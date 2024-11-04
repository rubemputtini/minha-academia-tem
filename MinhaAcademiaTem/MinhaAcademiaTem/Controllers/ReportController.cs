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

        public ReportController(ApplicationDbContext context, EmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        [HttpPost("send-gym-report")]
        public async Task<IActionResult> SendGymReport([FromBody] GymReportRequest request)
        {     
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName);
                
                if (user == null)
                {
                    return NotFound(new { message = "Usuário não encontrado." });
                }

                var gym = await _context.Gyms.FirstOrDefaultAsync(g => g.Name == request.GymName);
                
                if (gym == null)
                {
                    return NotFound(new { message = "Academia não encontrada." });
                }

                var report = new Report
                {
                    UserId = user.Id,
                    GymId = gym.GymId,
                    GymName = gym.Name,
                    GymLocation = gym.Location,
                    EquipmentSelections = request.EquipmentIds.Select(eId => new EquipmentSelection { EquipmentId = eId }).ToList(),
                };

                var previousReports = _context.Reports.Where(r => r.UserId == user.Id && r.GymId == gym.GymId);
                _context.Reports.RemoveRange(previousReports);

                _context.Reports.Add(report);
                await _context.SaveChangesAsync();

                var equipmentNames = await _context.Equipments
                    .Where(e => request.EquipmentIds.Contains(e.EquipmentId))
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
                return StatusCode(500, new { message = "Erro ao enviar o relatório.", details = ex.Message });
            }
        }
    }
}
