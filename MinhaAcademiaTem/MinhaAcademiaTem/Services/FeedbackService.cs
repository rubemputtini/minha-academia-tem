using Microsoft.EntityFrameworkCore;
using MinhaAcademiaTem.Data;
using MinhaAcademiaTem.Models;

namespace MinhaAcademiaTem.Services
{
    public class FeedbackService
    {
        private readonly ApplicationDbContext _context;

        public FeedbackService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Feedback> SaveFeedbackAsync(string userId, string message)
        {
            var feedback = new Feedback
            {
                UserId = userId,
                Message = message,
                CreatedAt = DateTime.UtcNow
            };

            _context.Feedbacks.Add(feedback);

            await _context.SaveChangesAsync();

            return feedback;
        }

        public async Task<List<Feedback>> GetAllFeedbackAsync()
        {
            return await _context.Feedbacks
                .Include(f => f.User)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Feedback>> GetFeedbacksByUserIdAsync(string userId)
        {
            return await _context.Feedbacks
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        } 
    }
}
