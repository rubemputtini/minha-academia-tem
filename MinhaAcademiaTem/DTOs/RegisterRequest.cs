using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "O E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O formatdo do E-mail é inválido.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Password { get; set; }
    }
}
