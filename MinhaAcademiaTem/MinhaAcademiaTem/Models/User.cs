using Microsoft.AspNetCore.Identity;

namespace MinhaAcademiaTem.Models
{
    public class User : IdentityUser
    {
        public bool IsAdmin { get; set; } = false;
        public string GymName { get; set; } = string.Empty;
        public string GymLocation { get; set; } = string.Empty;
    }
}
