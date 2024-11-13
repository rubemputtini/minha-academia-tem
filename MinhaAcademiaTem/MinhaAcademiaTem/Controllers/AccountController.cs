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

        [Authorize(Roles = "admin")]
        [HttpGet("user")]
        public IActionResult GetUser() => Ok(User.Identity!.Name);

        [Authorize(Roles = "admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var userResponses = new List<UserResponse>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                userResponses.Add(new UserResponse
                {
                    Id = user.Id,
                    Email = user.Email!,
                    Role = roles.FirstOrDefault()!
                });
            }

            return Ok(userResponses);
        }

        [Authorize]
        [HttpGet("details")]
        public async Task<IActionResult> GetUserDetails()
        {
            var user = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Email == User.Identity!.Name);

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
                Name = user.UserName!,
                Email = user.Email!,
                GymName = gym!.Name,
                GymLocation = gym.Location,
                SelectedExercises = selectedExercises
            };

            return Ok(userDetails);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("admin")]
        public IActionResult GetAdmin() => Ok(User.Identity!.Name);

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

            emailService.Send(
                "Administrador",
                adminEmail!,
                "Um novo usuário foi cadastrado!",
                $"O usuário {user.Email} foi registrado no sistema."
                );

            var token = _tokenService.GenerateToken(user, role);

            return Ok(new { message = "Usuário registrado com sucesso.", token });
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("delete-user")]
        public async Task<IActionResult> DeleteUser([FromBody] DeleteUserRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return ApiResponseHelper.GenerateErrorResponse(result.Errors);
            }

            return Ok("Usuário excluído com sucesso.");
        }
    }
}
