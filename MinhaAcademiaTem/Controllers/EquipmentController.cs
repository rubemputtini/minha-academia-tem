using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.Helpers;
using MinhaAcademiaTem.Models;

namespace MinhaAcademiaTem.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EquipmentController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetEquipments()
        {
            var equipments = await _context.Equipments.ToListAsync();
            return Ok(equipments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEquipment(int id)
        {
            var equipment = await _context.Equipments.FindAsync(id);

            if (equipment == null)
            {
                return NotFound(new { message = "Equipamento não encontrado." });
            }

            return Ok(equipment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEquipment([FromBody] Equipment equipment)
        {
            var gymExists = await _context.Gyms.AnyAsync(g => g.GymId == equipment.GymId);

            if (!gymExists)
            {
                return BadRequest(new { message = "ID da academia não existe." });
            }

            if (!ModelState.IsValid)
            {
                return ApiResponseHelper.GenerateErrorResponse(ModelState);
            }

            try
            {
                _context.Equipments.Add(equipment);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetEquipment), new { id = equipment.EquipmentId }, equipment);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Erro ao salvar o equipamento.", details = ex.InnerException?.Message });
            }
        }

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
                    return NotFound(new { message = "Equipamento não encontrado." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            var equipment = await _context.Equipments.FindAsync(id);

            if (equipment == null)
            {
                return NotFound(new { message = "Equipamento não encontrado." });
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
