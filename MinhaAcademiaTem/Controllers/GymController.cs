using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinhaAcademiaTem.Data;
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
                return NotFound();
            }

            return Ok(gym);
        }

        // POST: api/gym
        [HttpPost]
        public async Task<IActionResult> CreateGym([FromBody] Gym gym)
        {
            if (ModelState.IsValid)
            {
                _context.Gyms.Add(gym);
                await _context.SaveChangesAsync();
                return Ok(gym);
            }
            return BadRequest(ModelState);
        }

        // PUT: api/gym/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGym(int id, [FromBody] Gym gym)
        {
            if (id != gym.GymId)
            {
                return BadRequest("Academia não correspondente.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(gym).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GymExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/gym/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGym(int id)
        {
            var gym = await _context.Gyms.Include(g => g.Equipments).FirstOrDefaultAsync(g => g.GymId == id);

            if (gym == null)
            {
                return NotFound();
            }

            _context.Gyms.Remove(gym);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GymExists(int id)
        {
            return _context.Gyms.Any(g => g.GymId == id);
        }
    }

}
