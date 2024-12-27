using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class ForgotPasswordRequest
    {
        [Required(ErrorMessage = "O Email do usuário é obrigatório.")]
        public string Email { get; set; } = string.Empty;
    }
}
