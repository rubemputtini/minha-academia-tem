using Microsoft.AspNetCore.Identity;

namespace MinhaAcademiaTem.Models
{
    public class User : IdentityUser
    {
        public bool IsAdmin { get; set; } = false;
    }
}
