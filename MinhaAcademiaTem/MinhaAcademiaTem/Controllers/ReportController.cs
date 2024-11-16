using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.DTOs;
using MinhaAcademiaTem.Models;
using MinhaAcademiaTem.Services;

namespace MinhaAcademiaTem.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;

        public ReportController(ApplicationDbContext context, EmailService emailService, IConfiguration configuration, UserManager<User> userManager)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
            _userManager = userManager;
        }

        [Authorize]
        [HttpPost("save-selection")]
        public async Task<IActionResult> SaveEquipmentSelection([FromBody] EquipmentSelectionRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userName = User.Identity?.Name;

                if (string.IsNullOrEmpty(userName))
                {
                    return Unauthorized(new { message = "Usuário não autenticado." });
                }

                var user = await _userManager.FindByEmailAsync(userName);

                if (user == null)
                {
                    return NotFound(new { message = "Usuário não encontrado." });
                }

                var gym = await _context.Gyms.FirstOrDefaultAsync(g => g.UserId == user.Id);

                if (gym == null)
                {
                    return NotFound(new { message = "Academia não encontrada." });
                }

                var report = await _context.Reports
                    .Include(r => r.EquipmentSelections)
                    .FirstOrDefaultAsync(r => r.UserId == user.Id && r.GymId == gym.GymId);

                if (report == null)
                {
                    report = new Report
                    {
                        UserId = user.Id,
                        GymId = gym.GymId,
                        GymName = gym.Name,
                        GymLocation = gym.Location,
                        EquipmentSelections = request.EquipmentIds
                            .Select(eId => new EquipmentSelection 
                            { 
                                EquipmentId = eId,
                                UserId = user.Id, 
                                GymId = gym.GymId,
                                IsAvailable = true
                            })
                            .ToList()
                    };

                    _context.Reports.Add(report);
                }
                else
                {
                    _context.EquipmentSelections.RemoveRange(report.EquipmentSelections);

                    report.EquipmentSelections = request.EquipmentIds
                        .Select(eId => new EquipmentSelection 
                        { 
                            EquipmentId = eId, 
                            UserId = user.Id, 
                            GymId = gym.GymId,
                            IsAvailable = true
                        })
                        .ToList();

                    report.CreatedAt = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Seleção de equipamentos salva com sucesso." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao salvar a seleção de equipamentos.", details = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("send-gym-report")]
        public async Task<IActionResult> SendGymReport([FromBody] GymReportRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userName = User.Identity?.Name;

                if (string.IsNullOrEmpty(userName))
                {
                    return Unauthorized(new { message = "Usuário não autenticado." });
                }

                var user = await _userManager.FindByEmailAsync(userName);

                if (user == null)
                {
                    return NotFound(new { message = "Usuário não encontrado." });
                }

                var gym = await _context.Gyms.FirstOrDefaultAsync(g => g.Name == request.GymName && g.UserId == user.Id);

                if (gym == null)
                {
                    return NotFound(new { message = "Academia não encontrada." });
                }

                var report = await _context.Reports
                    .Include(r => r.EquipmentSelections)
                    .FirstOrDefaultAsync(r => r.UserId == user.Id && r.GymId == gym.GymId);

                if (report == null)
                {
                    return NotFound(new { message = "Seleção de equipamentos não encontrada." });
                }              

                var equipmentNames = await _context.Equipments
                    .Where(e => report.EquipmentSelections.Select(s => s.EquipmentId).Contains(e.EquipmentId))
                    .Select(e => e.Name)
                    .ToListAsync();

                var equipmentList = string.Join(", ", equipmentNames);
                var emailContent = $"A academia {gym.Name} cadastrada pelo usuário {request.UserName} possui os seguintes equipamentos: {equipmentList}";
                var adminEmail = _configuration["AdminSettings:AdminEmail"];

                _emailService.Send(
                    "Administrador",
                    adminEmail!,
                    $"Relatório da Academia {gym.Name}",
                    emailContent);

                return Ok(new { message = "Relatório enviado com sucesso." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Erro ao enviar o relatório.",
                    details = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [Authorize]
        [HttpPost("send-feedback")]
        public async Task<IActionResult> SendFeedback([FromBody] FeedbackRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "O feedback não pode estar vazio." });
            }

            try
            {
                var userName = User.Identity?.Name;

                if (string.IsNullOrEmpty(userName))
                {
                    return Unauthorized(new { message = "Usuário não autenticado." });
                }

                var user = await _userManager.FindByEmailAsync(userName);

                if (user == null)
                {
                    return NotFound(new { message = "Usuário não encontrado." });
                }

                var adminEmail = _configuration["AdminSettings:AdminEmail"];

                var emailContent = $"O usuário {user.Name} enviou um feedback dizendo o seguinte:\n\n{request.Feedback}";

                _emailService.Send(
                    "Administrador",
                    adminEmail!,
                    $"Feedback de Equipamentos da Academia do {user.Name}",
                    emailContent);

                return Ok(new { message = "Feedback enviado com sucesso." });
            }

            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Erro ao enviar o feedback.",
                    details = ex.InnerException?.Message ?? ex.Message
                });
            }
        }
    }
}
