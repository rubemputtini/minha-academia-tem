using Microsoft.EntityFrameworkCore;
using MinhaAcademiaTem.Models;

namespace MinhaAcademiaTem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Gym> Gyms { get; set; }
        public DbSet<Equipment> Equipments { get; set; }
    }
}
