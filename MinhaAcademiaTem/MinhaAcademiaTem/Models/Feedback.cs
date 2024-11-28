using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.Models
{
    public class Feedback
    {
        [Key]
        public int FeedbackId { get; set; }
        
        [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required(ErrorMessage = "A mensagem do feedback é obrigatória.")]
        public string Message { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
