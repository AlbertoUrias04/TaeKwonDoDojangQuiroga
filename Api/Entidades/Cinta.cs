using Api.Comun.Interfaces;

namespace Api.Entidades;

public class Cinta : ISlug
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int Orden { get; set; }
    public string ColorHex { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; } = true;
    public string Slug { get; set; } = string.Empty;

    // Relaciones
    public virtual ICollection<Alumno> Alumnos { get; set; } = new List<Alumno>();

    public string ObtenerDescripcionParaSlug() => Nombre;
}
