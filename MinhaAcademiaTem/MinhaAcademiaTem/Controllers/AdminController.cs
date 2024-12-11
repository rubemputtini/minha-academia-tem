using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.DTOs;
using MinhaAcademiaTem.Models;

namespace MinhaAcademiaTem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _dbContext;

        public AdminController(UserManager<User> userManager, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        [HttpGet("user")]
        public IActionResult GetUser() => Ok(User.Identity!.Name);

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(
            [FromServices] IMemoryCache memoryCache,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6)
        {
            var cacheKey = $"usersCache_page{page}_size{pageSize}";

            if (!memoryCache.TryGetValue(cacheKey, out List<UserResponse> userResponses))
            {
                var query = _userManager.Users.AsQueryable();

                var users = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
                
                userResponses = new List<UserResponse>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);

                    userResponses.Add(new UserResponse
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email!,
                        Role = roles.FirstOrDefault()!
                    });
                }

                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1)
                };

                memoryCache.Set(cacheKey, userResponses, cacheOptions);
            }

            var totalCount = await _userManager.Users.CountAsync();

            return Ok(new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                Users = userResponses
            });
        }

        [HttpGet("admin")]
        public IActionResult GetAdmin() => Ok(User.Identity!.Name);

        [HttpGet("GetUserEquipments/{userId}")]
        public async Task<IActionResult> GetUserEquipments(string userId)
        {
            try
            {
                var report = await _dbContext.Reports
                    .Include(r => r.EquipmentSelections)
                        .ThenInclude(es => es.Equipment)
                    .FirstOrDefaultAsync(r => r.UserId == userId);

                if (report == null)
                {
                    return NotFound(new { message = "Nenhum relatório encontrado para o usuário especificado." });
                }

                if (report.EquipmentSelections.Count == 0)
                {
                    return NotFound(new { message = "Nenhum equipamento selecionado encontrado para o relatório." });
                }

                var equipmentResponses = report.EquipmentSelections
                    .Select(es => new EquipmentResponse
                    {
                        EquipmentId = es.EquipmentId,
                        Name = es.Equipment!.Name,
                        PhotoUrl = es.Equipment!.PhotoUrl,
                        MuscleGroup = es.Equipment.MuscleGroup.ToString(),
                        IsAvailable = es.IsAvailable
                    })
                    .ToList();

                return Ok(equipmentResponses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao buscar equipamentos do usuário.", details = ex.Message });
            }
        }
    }
}
