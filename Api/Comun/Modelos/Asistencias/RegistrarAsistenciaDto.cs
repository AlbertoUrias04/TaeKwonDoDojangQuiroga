using System.ComponentModel.DataAnnotations;

namespace Api.Comun.Modelos.Asistencias;

public class RegistrarAsistenciaDto
{
    [Required]
    public int AlumnoId { get; set; }

    [Required]
    public int ClaseId { get; set; }

    public DateTime? FechaHoraSalida { get; set; }
}
