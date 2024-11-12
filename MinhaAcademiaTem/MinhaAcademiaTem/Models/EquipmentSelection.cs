using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MinhaAcademiaTem.Models
{
    public class EquipmentSelection
    {
        [Key]
        public int EquipmentSelectionId { get; set; }

        [Required(ErrorMessage = "O ID da Academia é obrigatório.")]
        public int GymId { get; set; }

        [ForeignKey("GymId")]
        public Gym Gym { get; set; } = new Gym();

        [Required(ErrorMessage = "O ID do Usuário é obrigatório.")]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public User User { get; set; } = new User();

        [Required(ErrorMessage = "O ID do Equipamento é obrigatório.")]
        public int EquipmentId { get; set; }

        [ForeignKey("EquipmentId")]
        public Equipment Equipment { get; set; } = new Equipment();

        public bool IsAvailable { get; set; } = false;
    }
}
