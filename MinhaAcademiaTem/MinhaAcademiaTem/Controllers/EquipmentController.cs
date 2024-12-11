using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.DTOs;
using MinhaAcademiaTem.Helpers;
using MinhaAcademiaTem.Models;

namespace MinhaAcademiaTem.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class EquipmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;

        public EquipmentController(ApplicationDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        [HttpGet]
        public async Task<IActionResult> GetEquipments()
        {
            try
            {
                var cacheKey = "equipmentsCache";

                if (!_cache.TryGetValue(cacheKey, out List<EquipmentResponse> equipments)) 
                {
                    equipments = await _context.Equipments
                        .Select(e => new EquipmentResponse
                        {
                            EquipmentId = e.EquipmentId,
                            Name = e.Name,
                            PhotoUrl = e.PhotoUrl,
                            VideoUrl = e.VideoUrl,
                            MuscleGroup = e.MuscleGroup.ToString()
                        })
                        .ToListAsync();

                    var cacheOptions = new MemoryCacheEntryOptions()
                        .SetAbsoluteExpiration(TimeSpan.FromHours(24));
                    _cache.Set(cacheKey, equipments, cacheOptions);
                }
                
                return Ok(equipments);
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao obter equipamentos.", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEquipment(int id)
        {
            try
            {
                var equipment = await _context.Equipments.FindAsync(id);

                if (equipment == null)
                {
                    return NotFound(new { message = "Equipamento não encontrado." });
                }

                return Ok(equipment);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao obter equipamento.", details = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CreateEquipment([FromBody] Equipment equipment)
        {            
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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro inesperado ao criar equipamento.", details = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro inesperado ao atualizar equipamento.", details = ex.Message });
            }

            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao excluir equipamento.", details = ex.Message });
            }
        }

        private bool EquipmentExists(int id)
        {
            return _context.Equipments.Any(e => e.EquipmentId == id);
        }
    }
}
