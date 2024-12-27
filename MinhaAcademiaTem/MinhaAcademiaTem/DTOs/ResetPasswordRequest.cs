using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class ResetPasswordRequest
    {
        [Required(ErrorMessage = "O Email do usuário é obrigatório.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Token do usuário é obrigatório.")]
        public string Token { get; set; } = string.Empty;

        [Required(ErrorMessage = "A nova senha do usuário é obrigatória.")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
