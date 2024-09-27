using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinhaAcademiaTem.DTOs;
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

        public AccountController(SignInManager<User> signInManager, UserManager<User> userManager, TokenService tokenService, RoleManager<IdentityRole> roleManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _roleManager = roleManager;
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
            var token = _tokenService.GenerateToken(user, roles.FirstOrDefault());

            return Ok(new LoginResponse
            {
                Token = token,
                Email = user.Email,
                Role = roles.FirstOrDefault()
            });
        }
        
        [Authorize(Roles = "user")]
        [HttpGet("user")]
        public IActionResult GetUser() => Ok(User.Identity.Name);

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("admin")]
        public IActionResult GetAdmin() => Ok(User.Identity.Name);

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = new User
            {
                UserName = request.Email,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var roleExists = await _roleManager.RoleExistsAsync("user");

            if (!roleExists)
            {
                await _roleManager.CreateAsync(new IdentityRole("user"));
            }

            await _userManager.AddToRoleAsync(user, "user");

            return Ok("Usuário registrado com sucesso.");
        }
    }
}
