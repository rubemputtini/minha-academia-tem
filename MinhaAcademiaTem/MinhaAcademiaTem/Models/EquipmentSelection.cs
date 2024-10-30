using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MinhaAcademiaTem.Models
{
    public class EquipmentSelection
    {
        [Key]
        public int EquipmentSelectionId { get; set; }

        [Required(ErrorMessage = "O ID do relatório é obrigatório.")]
        public int ReportId { get; set; }

        [Required(ErrorMessage = "O ID do equipamento é obrigatório.")]
        public int EquipmentId { get; set; }

        [ForeignKey("EquipmentId")]
        public Equipment Equipment { get; set; }
    }
}
