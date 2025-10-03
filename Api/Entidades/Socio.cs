using System.ComponentModel.DataAnnotations.Schema;
using Api.Comun.Interfaces;

namespace Api.Entidades;

public class Socio : ISlug
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public DateTime? FechaNacimiento { get; set; }
    public string? Direccion { get; set; }
    public bool Activo { get; set; }
    public string Slug { get; set; } = string.Empty;

    public int? SucursalId { get; set; }
    public virtual Sucursal? Sucursal { get; set; }

    public virtual List<SocioMembresia> SocioMembresias { get; set; } = new List<SocioMembresia>();
    public virtual List<Pago> Pagos { get; set; } = new List<Pago>();
    public virtual List<Asistencia> Asistencias { get; set; } = new List<Asistencia>();

    public string ObtenerDescripcionParaSlug() => $"{Nombre}-{ApellidoPaterno}";
}
