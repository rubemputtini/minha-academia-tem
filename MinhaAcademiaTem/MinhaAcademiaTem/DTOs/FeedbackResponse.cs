namespace MinhaAcademiaTem.DTOs
{
    public class FeedbackResponse
    {
        public int FeedbackId { get; set; }
        public string UserId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
