using System.ComponentModel.DataAnnotations;

namespace Api.Comun.Modelos.Membresias;

public class ModificarMembresiaDto
{
    [Required]
    public string Slug { get; set; } = string.Empty;

    [Required]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Precio { get; set; }

    [Required]
    [Range(1, 3650)]
    public int DuracionDias { get; set; }

    public string? Descripcion { get; set; }
    public bool Activa { get; set; }
}
