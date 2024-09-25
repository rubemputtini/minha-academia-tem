using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.Helpers;
using MinhaAcademiaTem.Models;

namespace MinhaAcademiaTem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GymController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GymController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/gym
        [HttpGet]
        public async Task<IActionResult> GetGyms()
        {
            var gyms = await _context.Gyms.Include(g => g.Equipments).ToListAsync();
            return Ok(gyms);
        }

        // GET: api/gym/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGym(int id)
        {
            var gym = await _context.Gyms.Include(g => g.Equipments).FirstOrDefaultAsync(g => g.GymId == id);

            if (gym == null)
            {
                return NotFound(new { message = "Academia não encontrada." });
            }

            return Ok(gym);
        }

        // POST: api/gym
        [HttpPost]
        public async Task<IActionResult> CreateGym([FromBody] Gym gym)
        {
            if (!ModelState.IsValid)
            {
                return ApiResponseHelper.GenerateErrorResponse(ModelState);
            }

            _context.Gyms.Add(gym);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGym), new { id = gym.GymId }, gym);
        }

        // PUT: api/gym/{id}
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
        }

        // DELETE: api/gym/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGym(int id)
        {
            var gym = await _context.Gyms.Include(g => g.Equipments).FirstOrDefaultAsync(g => g.GymId == id);

            if (gym == null)
            {
                return NotFound(new { message = "A academia com o ID fornecido não foi encontrada." });
            }

            _context.Gyms.Remove(gym);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Academia excluída com sucesso." });
        }

        private bool GymExists(int id)
        {
            return _context.Gyms.Any(g => g.GymId == id);
        }

    }

}
