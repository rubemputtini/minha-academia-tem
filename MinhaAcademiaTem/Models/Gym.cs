namespace MinhaAcademiaTem.Models
{
    public class Gym
    {
        public int GymId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }

        // Relação com Equipments
        public ICollection<Equipment>? Equipments { get; set; }
    }

}
