using System.ComponentModel.DataAnnotations;

namespace Api.Comun.Modelos.Clases;

public class ModificarClaseDto
{
    [Required]
    public string Slug { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre es requerido")]
    [MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "Los días son requeridos")]
    [MaxLength(200)]
    public string Dias { get; set; } = string.Empty;

    [Required(ErrorMessage = "La hora de inicio es requerida")]
    public TimeSpan HoraInicio { get; set; }

    [Required(ErrorMessage = "La hora de fin es requerida")]
    public TimeSpan HoraFin { get; set; }

    public int? CupoMaximo { get; set; }

    [Required(ErrorMessage = "El tipo de clase es requerido")]
    [MaxLength(50)]
    public string TipoClase { get; set; } = string.Empty;

    [Required]
    public bool Activo { get; set; }
}
