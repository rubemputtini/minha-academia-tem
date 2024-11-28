using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.DTOs;
using MinhaAcademiaTem.Models;
using MinhaAcademiaTem.Services;

namespace MinhaAcademiaTem.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class FeedbackController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly FeedbackService _feedbackService;

        public FeedbackController(ApplicationDbContext context, EmailService emailService, IConfiguration configuration, UserManager<User> userManager, FeedbackService feedbackService)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
            _userManager = userManager;
            _feedbackService = feedbackService;
        }

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

                await _feedbackService.SaveFeedbackAsync(user.Id, request.Message);

                var adminEmail = _configuration["AdminSettings:AdminEmail"];

                var templateData = new Dictionary<string, string>
                {
                    { "Name", user.Name },
                    { "Feedback", request.Message }
                };

                await _emailService.SendEmailAsync(
                    toName: "Administrador",
                    toEmail: adminEmail!,
                    subject: "Novo Feedback Recebido - Minha Academia TEM?",
                    templateName: "FeedbackTemplate",
                    templateData: templateData);

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

        [HttpGet("list-feedbacks")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbackAsync();

                return Ok(feedbacks.Select(f => new FeedbackResponse
                {
                   FeedbackId = f.FeedbackId,
                   UserId = f.UserId,
                   Message = f.Message,
                   CreatedAt = f.CreatedAt
                }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Erro ao obter os feedbacks.",
                    details = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpGet("user-feedbacks/{userId}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetFeedbackByUser(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "Usuário não encontrado." });
                }

                var feedbacks = await _feedbackService.GetFeedbacksByUserIdAsync(userId);

                return Ok(feedbacks.Select(f => new FeedbackResponse
                {
                    FeedbackId = f.FeedbackId,
                    UserId = f.UserId,
                    Message = f.Message,
                    CreatedAt = f.CreatedAt
                }));

            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Erro ao obter os feedbacks do usuário.",
                    details = ex.InnerException?.Message ?? ex.Message
                });
            }
        }
    }
}
