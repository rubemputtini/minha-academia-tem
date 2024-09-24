using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.Models;

namespace MinhaAcademiaTem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EquipmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/equipment
        [HttpGet]
        public async Task<IActionResult> GetEquipments()
        {
            var equipments = await _context.Equipments.ToListAsync();
            return Ok(equipments);
        }

        // GET: api/equipment/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEquipment(int id)
        {
            var equipment = await _context.Equipments.FindAsync(id);

            if (equipment == null)
            {
                return NotFound();
            }

            return Ok(equipment);
        }

        // POST: api/equipment
        [HttpPost]
        public async Task<IActionResult> CreateEquipment([FromBody] Equipment equipment)
        {
            if (ModelState.IsValid)
            {
                _context.Equipments.Add(equipment);
                await _context.SaveChangesAsync();
                return Ok(equipment);
            }

            return BadRequest(ModelState);
        }

        // PUT: api/equipment/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEquipment(int id, [FromBody] Equipment equipment)
        {
            if (id != equipment.EquipmentId)
            {
                return BadRequest("Equipamento não correspondente.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(equipment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipmentExists(id))
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

        // DELETE: api/equipment/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            var equipment = await _context.Equipments.FindAsync(id);

            if (equipment == null)
            {
                return NotFound();
            }

            _context.Equipments.Remove(equipment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EquipmentExists(int id)
        {
            return _context.Equipments.Any(e => e.EquipmentId == id);
        }
    }
}
