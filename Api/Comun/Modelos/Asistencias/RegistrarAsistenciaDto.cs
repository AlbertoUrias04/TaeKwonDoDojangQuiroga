using System.ComponentModel.DataAnnotations;

namespace Api.Comun.Modelos.Asistencias;

public class RegistrarAsistenciaDto
{
    [Required]
    public int SocioId { get; set; }

    [Required]
    public int SucursalId { get; set; }

    public DateTime? FechaHoraSalida { get; set; }
}
