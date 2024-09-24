namespace MinhaAcademiaTem.Models
{
    public class Equipment
    {
        public int EquipmentId { get; set; }
        public string Name { get; set; }
        public string PhotoUrl { get; set; }
        public string VideoUrl { get; set; }
        public int GymId { get; set; }
        public Gym? Gym { get; set; }
    }
}
