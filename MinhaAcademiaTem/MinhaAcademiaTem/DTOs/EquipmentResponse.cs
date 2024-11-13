namespace MinhaAcademiaTem.DTOs
{
    public class EquipmentResponse
    {
        public int EquipmentId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PhotoUrl { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string MuscleGroup { get; set; } = string.Empty;
    }
}
