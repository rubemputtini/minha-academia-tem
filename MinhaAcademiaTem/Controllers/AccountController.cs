﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public AccountController(SignInManager<User> signInManager, UserManager<User> userManager, TokenService tokenService, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _roleManager = roleManager;
            _configuration = configuration;
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

            var adminEmail = _configuration["AdminSettings:AdminEmail"];

            emailService.Send(
                "Administrador",
                adminEmail!,
                "Um novo usuário foi cadastrado!",
                $"O usuário {user.Email} foi registrado no sistema."
                );

            return Ok("Usuário registrado com sucesso.");
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
