using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class EditUserRequest
    {
        [Required(ErrorMessage = "O nome do usuário é obrigatório.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "O E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O formato do E-mail é inválido.")] public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "O nome da academia é obrigatório.")]
        public string GymName { get; set; } = string.Empty;

        [Required(ErrorMessage = "A localização é obrigatória.")]
        public string GymLocation { get; set; } = string.Empty;
    }
}
