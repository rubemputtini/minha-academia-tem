using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class EquipmentSelectionRequest
    {
        [Required(ErrorMessage = "Os IDs dos equipamentos selecionados são obrigatórios.")]
        public List<int> EquipmentIds { get; set; } = new List<int>();
    }
}
