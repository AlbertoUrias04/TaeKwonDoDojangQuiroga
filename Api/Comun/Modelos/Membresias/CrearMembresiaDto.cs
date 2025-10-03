using System.ComponentModel.DataAnnotations;

namespace Api.Comun.Modelos.Membresias;

public class CrearMembresiaDto
{
    [Required(ErrorMessage = "El nombre de la membresía es requerido")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El precio es requerido")]
    [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
    public decimal Precio { get; set; }

    [Required(ErrorMessage = "La duración es requerida")]
    [Range(1, 3650, ErrorMessage = "La duración debe estar entre 1 y 3650 días")]
    public int DuracionDias { get; set; }

    public string? Descripcion { get; set; }
    public bool Activa { get; set; } = true;
}
