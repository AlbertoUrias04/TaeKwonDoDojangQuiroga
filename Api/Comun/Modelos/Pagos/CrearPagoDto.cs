namespace Api.Comun.Modelos.Pagos;

public class CrearPagoDto
{
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; } = DateTime.Now;
    public string MetodoPago { get; set; } = string.Empty; // "Efectivo", "Tarjeta", "Transferencia"
    public string? Referencia { get; set; }
    public string? Notas { get; set; }

    public int AlumnoId { get; set; }
    public int ConceptoId { get; set; }
    public int? AlumnoInscripcionId { get; set; }
}
