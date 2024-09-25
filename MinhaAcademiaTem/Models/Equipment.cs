using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MinhaAcademiaTem.Models
{
    public class Equipment
    {
        [Key]
        public int EquipmentId { get; set; }

        [Required(ErrorMessage = "O nome do equipamento é obrigatório.")]
        [StringLength(60, ErrorMessage = "O nome do equipamento não pode exceder 60 caracteres.")]
        public string Name { get; set; }

        [Url(ErrorMessage = "A URL da foto é inválida.")]
        public string PhotoUrl { get; set; }

        [Url(ErrorMessage = "A URL do vídeo é inválida.")]
        public string VideoUrl { get; set; }

        [Required(ErrorMessage = "O ID da academia é obrigatório.")]
        public int GymId { get; set; }

        [ForeignKey("GymId")]
        [JsonIgnore]
        public Gym? Gym { get; set; }
    }
}
