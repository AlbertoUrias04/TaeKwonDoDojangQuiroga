using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Entidades;

public class Pago
{
    public int Id { get; set; }
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public string MetodoPago { get; set; } = string.Empty; // "Efectivo", "Tarjeta", "Transferencia"
    public string Estado { get; set; } = string.Empty; // "Confirmado", "Pendiente", "Rechazado"
    public string? Referencia { get; set; }

    public int SocioId { get; set; }
    [JsonIgnore]
    public virtual Socio Socio { get; set; } = null!;

    public int SocioMembresiaId { get; set; }
    [JsonIgnore]
    public virtual SocioMembresia SocioMembresia { get; set; } = null!;

    public int SucursalId { get; set; }
    [JsonIgnore]
    public virtual Sucursal Sucursal { get; set; } = null!;

    public int UsuarioRegistroId { get; set; }
    [JsonIgnore]
    public virtual Usuario UsuarioRegistro { get; set; } = null!;
}
