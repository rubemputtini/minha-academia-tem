using Microsoft.AspNetCore.Identity;

namespace MinhaAcademiaTem.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } = false;
    }
}
