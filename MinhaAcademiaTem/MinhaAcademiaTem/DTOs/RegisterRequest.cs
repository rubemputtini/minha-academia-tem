using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "O Nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O Nome deve ter no máximo 50 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "O E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O formato do E-mail é inválido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "A academia é obrigatória.")]
        public string GymName { get; set; } = string.Empty;

        [Required(ErrorMessage = "A localização é obrigatória.")]
        public string GymLocation { get; set; } = string.Empty;
    }
}
