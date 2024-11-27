using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.DTOs;
using MinhaAcademiaTem.Helpers;
using MinhaAcademiaTem.Models;
using MinhaAcademiaTem.Services;

namespace MinhaAcademiaTem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;

        public AccountController(SignInManager<User> signInManager, UserManager<User> userManager, TokenService tokenService, RoleManager<IdentityRole> roleManager, IConfiguration configuration, ApplicationDbContext dbContext)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _roleManager = roleManager;
            _configuration = configuration;
            _dbContext = dbContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return Unauthorized("E-mail inválido.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

            if (!result.Succeeded)
            {
                return Unauthorized("Senha inválida.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userRole = roles.FirstOrDefault() ?? "user";

            var token = _tokenService.GenerateToken(user, userRole);

            return Ok(new LoginResponse
            {
                Token = token,
                Email = user.Email!,
                Role = userRole
            });
        }

        [Authorize]
        [HttpGet("details/{userId?}")]
        public async Task<IActionResult> GetUserDetails(string? userId = null)
        {
            var user = userId == null 
                ? await _userManager.Users.FirstOrDefaultAsync(u => u.Email == User.Identity!.Name)
                : await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            var gym = await _dbContext.Gyms
                .FirstOrDefaultAsync(g => g.UserId == user.Id);

            var report = await _dbContext.Reports
                .Include(r => r.EquipmentSelections)
                .ThenInclude(es => es.Equipment)
                .FirstOrDefaultAsync(r => r.UserId == user.Id);

            var selectedExercises = report?.EquipmentSelections
                .Select(es => new EquipmentResponse
                {
                    EquipmentId = es.EquipmentId,
                    Name = es.Equipment!.Name,
                    PhotoUrl = es.Equipment.PhotoUrl,
                    VideoUrl = es.Equipment.VideoUrl,
                    MuscleGroup = es.Equipment.MuscleGroup.ToString()
                })
                .ToList() ?? new List<EquipmentResponse>();

            var userDetails = new UserDetailsResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email!,
                GymName = gym!.Name,
                GymLocation = gym.Location,
                SelectedExercises = selectedExercises
            };

            return Ok(userDetails);
        }

        [Authorize]
        [HttpPut("edit-user/{userId}")]
        public async Task<IActionResult> EditUser(string userId, [FromBody] EditUserRequest request)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("ID do usuário não fornecido");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            user.Name = request.Name ?? user.Name;
            user.Email = request.Email ?? user.Email;
            user.UserName = request.Email ?? user.Email;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return ApiResponseHelper.GenerateErrorResponse(result.Errors);
            }

            var gym = await _dbContext.Gyms.FirstOrDefaultAsync(g => g.UserId == userId);

            if (gym != null)
            {
                gym.Name = request.GymName ?? gym.Name;
                gym.Location = request.GymLocation ?? gym.Location;

                await _dbContext.SaveChangesAsync();
            }

            return Ok(new { message = "Usuário atualizado com sucesso." });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request, [FromServices] EmailService emailService)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);

            if (existingUser != null)
            {
                return BadRequest("Já existe um usuário com esse E-mail.");
            }
            
            var user = new User
            {
                Name = request.Name,
                UserName = request.Email,
                Email = request.Email,
                IsAdmin = request.Email == _configuration["AdminSettings:AdminEmail"]
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return ApiResponseHelper.GenerateErrorResponse(result.Errors);
            }

            var role = user.IsAdmin ? "admin" : "user";

            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }

            await _userManager.AddToRoleAsync(user, role);

            var gym = new Gym
            {
                Name = request.GymName,
                Location = request.GymLocation,
                User = user
            };

            _dbContext.Gyms.Add(gym);
            await _dbContext.SaveChangesAsync();

            var adminEmail = _configuration["AdminSettings:AdminEmail"];

            var templateData = new Dictionary<string, string>
                {
                    { "Name", user.Name },
                    { "UserEmail", user.Email },
                    { "GymName", request.GymName },
                    { "GymLocation", request.GymLocation },
                };

            await emailService.SendEmailAsync(
                toName: "Administrador",
                toEmail: adminEmail!,
                subject: "Um novo usuário foi cadastrado - Minha Academia TEM?",
                templateName: "UserRegistrationTemplate",
                templateData: templateData);

            var token = _tokenService.GenerateToken(user, role);

            return Ok(new { message = "Usuário registrado com sucesso.", token });
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("delete-user")]
        public async Task<IActionResult> DeleteUser([FromBody] DeleteUserRequest request)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var user = await _userManager.FindByIdAsync(request.Id);

                if (user == null)
                {
                    return NotFound("Usuário não encontrado.");
                }

                var gyms = _dbContext.Gyms.Where(g => g.UserId == user.Id);
                _dbContext.Gyms.RemoveRange(gyms);

                var reports = _dbContext.Reports.Include(r => r.EquipmentSelections).Where(r => r.UserId == user.Id);
                _dbContext.Reports.RemoveRange(reports);

                var equipmentSelections = _dbContext.EquipmentSelections.Where(es => es.UserId == user.Id);
                _dbContext.EquipmentSelections.RemoveRange(equipmentSelections);

                await _dbContext.SaveChangesAsync();

                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return ApiResponseHelper.GenerateErrorResponse(result.Errors);
                }

                await transaction.CommitAsync();

                return Ok("Usuário excluído com sucesso.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }
    }
}
