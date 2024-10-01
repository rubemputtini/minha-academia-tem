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
                var gym = await _context.Gyms
                    .Include(g => g.Equipments)
                    .FirstOrDefaultAsync(g => g.Name == request.GymName);

                if (gym == null)
                {
                    return NotFound(new { message = "Academia não encontrada." });
                }

                var equipmentList = string.Join(", ", gym.Equipments.Select(e => e.Name));
                var emailContent = $"A academia {gym.Name} cadastrada pelo usuário {request.UserName} possui os seguintes equipamentos: {equipmentList}";
                var adminEmail = _configuration["AdminSettings:AdminEmail"];


                _emailService.Send(
                    "Administrador",
                    adminEmail,
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
