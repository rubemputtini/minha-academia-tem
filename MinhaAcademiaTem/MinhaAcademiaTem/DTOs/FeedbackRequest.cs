using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class FeedbackRequest
    {
        [Required]
        public string Feedback { get; set; } = string.Empty;
    }
}
