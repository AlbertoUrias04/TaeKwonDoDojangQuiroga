using System.ComponentModel.DataAnnotations.Schema;
using Api.Comun.Interfaces;

namespace Api.Entidades;

public class Membresia : ISlug
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty; // "Básica", "Premium", "VIP", "Diaria"
    public decimal Precio { get; set; }
    public int DuracionDias { get; set; } // 1, 30, 90, 180, 365
    public string? Descripcion { get; set; }
    public bool Activa { get; set; }
    public string Slug { get; set; } = string.Empty;

    public virtual List<SocioMembresia> SocioMembresias { get; set; } = new List<SocioMembresia>();

    public string ObtenerDescripcionParaSlug() => Nombre;
}
