using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.DTOs
{
    public class GymReportRequest
    {
        [Required(ErrorMessage = "O nome da academia é obrigatório.")]
        public string GymName { get; set; } = string.Empty;

        [Required(ErrorMessage = "O nome do usuário é obrigatório.")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Os IDs dos equipamentos são obrigatórios.")]
        public List<int> EquipmentIds { get; set; } = new List<int>();
    }
}
