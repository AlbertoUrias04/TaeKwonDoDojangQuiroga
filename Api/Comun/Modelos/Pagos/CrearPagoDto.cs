using System.ComponentModel.DataAnnotations;

namespace Api.Comun.Modelos.Pagos;

public class CrearPagoDto
{
    [Required]
    public decimal Monto { get; set; }

    [Required]
    public string MetodoPago { get; set; } = string.Empty; // "Efectivo", "Tarjeta", "Transferencia"

    public string? Referencia { get; set; }

    [Required]
    public int SocioId { get; set; }

    [Required]
    public int SocioMembresiaId { get; set; }

    [Required]
    public int SucursalId { get; set; }
}
