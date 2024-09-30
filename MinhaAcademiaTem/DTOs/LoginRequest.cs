using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "O E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O formato do E-mail é inválido.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Password { get; set; }
    }
}
