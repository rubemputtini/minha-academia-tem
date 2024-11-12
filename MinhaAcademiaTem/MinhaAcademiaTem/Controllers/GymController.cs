using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.Helpers;
using MinhaAcademiaTem.Models;
using System.Security.Claims;

namespace MinhaAcademiaTem.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class GymController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GymController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetGyms()
        {
            try
            {
                var gyms = await _context.Gyms.ToListAsync();
                return Ok(gyms);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao obter academias.", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGym(int id)
        {
            try
            {
                var gym = await _context.Gyms.FirstOrDefaultAsync(g => g.GymId == id);

                if (gym == null)
                {
                    return NotFound(new { message = "Academia não encontrada." });
                }

                return Ok(gym);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao obter a academia.", details = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateGym([FromBody] Gym gym)
        {
            if (!ModelState.IsValid)
            {
                return ApiResponseHelper.GenerateErrorResponse(ModelState);
            }

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (userId == null)
                {
                    return Unauthorized(new { message = "Usuário não autorizado." });
                }

                gym.UserId = userId;
                _context.Gyms.Add(gym);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetGym), new { id = gym.GymId }, gym);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Erro ao salvar a academia.", details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro inesperado ao criar academia.", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGym(int id, [FromBody] Gym gym)
        {
            if (id != gym.GymId)
            {
                return BadRequest(new { message = "O ID da academia no corpo da requisição não corresponde ao ID na URL." });
            }

            if (!ModelState.IsValid)
            {
                return ApiResponseHelper.GenerateErrorResponse(ModelState);
            }

            _context.Entry(gym).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GymExists(id))
                {
                    return NotFound(new { message = "A academia com o ID fornecido não foi encontrada." });
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro inesperado ao atualizar academia.", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGym(int id)
        {
            try
            {
                var gym = await _context.Gyms.FirstOrDefaultAsync(g => g.GymId == id);

                if (gym == null)
                {
                    return NotFound(new { message = "A academia com o ID fornecido não foi encontrada." });
                }

                _context.Gyms.Remove(gym);

                await _context.SaveChangesAsync();

                return Ok(new { message = "Academia excluída com sucesso." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao excluir academia.", details = ex.Message });
            }
        }

        private bool GymExists(int id)
        {
            return _context.Gyms.Any(g => g.GymId == id);
        }
    }
}
