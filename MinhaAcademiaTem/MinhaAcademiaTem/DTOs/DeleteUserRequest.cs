using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class DeleteUserRequest
    {
        [Required(ErrorMessage = "O E-mail do usuário é obrigatório.")]
        public string Email { get; set; } = string.Empty;
    }
}
