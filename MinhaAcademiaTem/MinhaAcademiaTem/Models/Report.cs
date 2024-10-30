﻿using System.ComponentModel.DataAnnotations;

namespace MinhaAcademiaTem.Models
{
    public class Report
    {
        [Key]
        public int ReportId { get; set; }

        [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "O ID da academia é obrigatório.")]
        public int GymId { get; set; }

        [Required(ErrorMessage = "O nome da academia é obrigatório.")]
        public string GymName { get; set; } = string.Empty;

        [Required(ErrorMessage = "A localização da academia é obrigatória.")]
        public string GymLocation { get; set; } = string.Empty;

        public List<EquipmentSelection> EquipmentSelections { get; set; } = new List<EquipmentSelection>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
