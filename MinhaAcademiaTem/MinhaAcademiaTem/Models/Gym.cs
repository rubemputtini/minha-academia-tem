using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MinhaAcademiaTem.Models
{
    public class Gym
    {
        [Key]
        public int GymId { get; set; }

        [Required(ErrorMessage = "O nome da academia é obrigatório.")]
        [StringLength(40, ErrorMessage = "O nome não pode ter mais que 40 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "A localização é obrigatória.")]
        [StringLength(40, ErrorMessage = "A localização não pode ter mais que 40 caracteres.")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public string UserId { get; set; } = string.Empty;

        [JsonIgnore]
        public User User { get; set; } = new User();
    }

}
