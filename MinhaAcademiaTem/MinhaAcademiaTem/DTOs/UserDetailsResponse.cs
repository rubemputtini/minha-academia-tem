namespace MinhaAcademiaTem.DTOs
{
    public class UserDetailsResponse
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string GymName { get; set; } = string.Empty;
        public string GymLocation { get; set; } = string.Empty;
        public List<EquipmentResponse> SelectedExercises { get; set; } = new List<EquipmentResponse>();
    }
}
