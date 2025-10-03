using System.ComponentModel.DataAnnotations.Schema;
using Api.Comun.Interfaces;

namespace Api.Entidades;

public class Sucursal : ISlug
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string Slug { get; set; } = string.Empty;
    public bool Habilitado { get; set; }

    public virtual List<Usuario> Usuarios { get; set; } = new List<Usuario>();
    public virtual List<Socio> Socios { get; set; } = new List<Socio>();

    public string ObtenerDescripcionParaSlug() => Nombre;
}
