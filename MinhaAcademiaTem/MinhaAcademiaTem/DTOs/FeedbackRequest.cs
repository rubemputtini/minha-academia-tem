using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class FeedbackRequest
    {
        [Required]
        public string Message { get; set; } = string.Empty;
    }
}
