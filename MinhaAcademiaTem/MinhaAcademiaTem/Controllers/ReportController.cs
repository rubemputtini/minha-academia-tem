using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.DTOs;
using MinhaAcademiaTem.Models;
using MinhaAcademiaTem.Services;

namespace MinhaAcademiaTem.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly IMemoryCache _cache;

        public ReportController(ApplicationDbContext context, EmailService emailService, IConfiguration configuration, UserManager<User> userManager, IMemoryCache cache)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
            _userManager = userManager;
            _cache = cache;
        }

        [HttpPost("save-selection")]
        public async Task<IActionResult> SaveEquipmentSelection([FromBody] EquipmentSelectionRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = User.Identity!.Name;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Usuário não autenticado." });
                }

                var user = await _userManager.FindByEmailAsync(userId);

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

                var allEquipmentIds = await _context.Equipments.Select(e => e.EquipmentId).ToListAsync();

                if (report == null)
                {
                    report = new Report
                    {
                        UserId = user.Id,
                        GymId = gym.GymId,
                        GymName = gym.Name,
                        GymLocation = gym.Location,
                        EquipmentSelections = allEquipmentIds
                            .Select(eId => new EquipmentSelection
                            {
                                EquipmentId = eId,
                                UserId = user.Id,
                                GymId = gym.GymId,
                                IsAvailable = request.EquipmentIds.Contains(eId)
                            })
                            .ToList()
                    };

                    _context.Reports.Add(report);
                }
                else
                {
                    _context.EquipmentSelections.RemoveRange(report.EquipmentSelections);

                    report.EquipmentSelections = allEquipmentIds
                        .Select(eId => new EquipmentSelection
                        {
                            EquipmentId = eId,
                            UserId = user.Id,
                            GymId = gym.GymId,
                            IsAvailable = request.EquipmentIds.Contains(eId)
                        })
                        .ToList();

                    report.CreatedAt = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                var cacheKey = $"userDetails_{userId}";

                var updatedUserDetails = new UserDetailsResponse
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email!,
                    GymName = gym.Name,
                    GymLocation = gym.Location,
                    SelectedExercises = report.EquipmentSelections
                        .Select(es => new EquipmentResponse
                        {
                            EquipmentId = es.EquipmentId,
                            Name = es.Equipment!.Name,
                            PhotoUrl = es.Equipment.PhotoUrl,
                            VideoUrl = es.Equipment.VideoUrl,
                            MuscleGroup = es.Equipment.MuscleGroup.ToString(),
                            IsAvailable = es.IsAvailable
                        })
                        .ToList()
                };

                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(2));
                _cache.Set(cacheKey, updatedUserDetails, cacheOptions);

                return Ok(new { message = "Seleção de equipamentos salva com sucesso." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao salvar a seleção de equipamentos.", details = ex.Message });
            }
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

                var availableEquipmentIds = report.EquipmentSelections
                    .Where(s => s.IsAvailable)
                    .Select(s => s.EquipmentId)
                    .ToList();

                var equipmentNames = await _context.Equipments
                    .Where(e => availableEquipmentIds.Contains(e.EquipmentId))
                    .Select(e => e.Name)
                    .ToListAsync();

                var equipmentList = string.Join(", ", equipmentNames);

                var templateData = new Dictionary<string, string>
                {
                    { "Name", user.Name },
                    { "GymName", gym.Name },
                    { "EquipmentItems", string.Join("", equipmentNames.Select(e => $"<li>{e}</li>")) }

                };

                var adminEmail = _configuration["AdminSettings:AdminEmail"];

                await _emailService.SendEmailAsync(
                    toName: "Administrador",
                    toEmail: adminEmail!,
                    subject: "Relatório da Academia - Minha Academia TEM?",
                    templateName: "GymReportTemplate",
                    templateData: templateData
                );

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

        [HttpGet("equipment-selections")]
        public async Task<IActionResult> GetEquipmentSelections()
        {
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

                var equipmentSelections = await _context.EquipmentSelections
                    .Where(es => es.UserId == user.Id)
                    .Select(es => new
                    {
                        es.EquipmentId,
                        es.IsAvailable,
                        EquipmentName = _context.Equipments
                            .Where(e => e.EquipmentId == es.EquipmentId)
                            .Select(e => e.Name)
                            .FirstOrDefault()
                    })
                    .ToListAsync();

                return Ok(equipmentSelections);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Erro ao buscar seleções de equipamentos.",
                    details = ex.InnerException?.Message ?? ex.Message
                });
            }
        }
    }
}
