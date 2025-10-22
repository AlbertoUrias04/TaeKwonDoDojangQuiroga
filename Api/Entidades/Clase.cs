using Api.Comun.Interfaces;

namespace Api.Entidades;

public class Clase : ISlug
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Dias { get; set; } = string.Empty; // Ej: "Lunes, Miércoles, Viernes"
    public TimeSpan HoraInicio { get; set; }
    public TimeSpan HoraFin { get; set; }
    public int? CupoMaximo { get; set; }
    public string TipoClase { get; set; } = string.Empty; // Infantil, Juvenil, Adultos, Competencia
    public bool Activo { get; set; } = true;
    public string Slug { get; set; } = string.Empty;

    // Relaciones
    public virtual ICollection<Alumno> Alumnos { get; set; } = new List<Alumno>();
    public virtual ICollection<Asistencia> Asistencias { get; set; } = new List<Asistencia>();

    public string ObtenerDescripcionParaSlug() => Nombre;
}
