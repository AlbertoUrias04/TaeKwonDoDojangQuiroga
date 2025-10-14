

namespace Api.Comun.Modelos.Pagos;

public class CrearPagoDto
{
    public decimal Monto { get; set; }
    public string MetodoPago { get; set; } = string.Empty;
    public string? Referencia { get; set; }
    public int SocioId { get; set; }
    public int SocioMembresiaId { get; set; }
    public int SucursalId { get; set; }
    public int UsuarioRegistroId { get; set; }
}