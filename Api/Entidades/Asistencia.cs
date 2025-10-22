using System.Text.Json.Serialization;

namespace Api.Entidades;

public class Asistencia
{
    public int Id { get; set; }
    public DateTime FechaHoraEntrada { get; set; }
    public DateTime? FechaHoraSalida { get; set; }

    public int AlumnoId { get; set; }
    [JsonIgnore]
    public virtual Alumno Alumno { get; set; } = null!;

    public int ClaseId { get; set; }
    [JsonIgnore]
    public virtual Clase Clase { get; set; } = null!;

    public int UsuarioRegistroId { get; set; }
    [JsonIgnore]
    public virtual Usuario UsuarioRegistro { get; set; } = null!;
}
