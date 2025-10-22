using System.ComponentModel.DataAnnotations;

namespace Api.Comun.Modelos.Alumnos;

public class CambiarEstadoAlumnoDto
{
    [Required]
    public string Slug { get; set; } = string.Empty;

    [Required]
    public bool Activo { get; set; }
}
