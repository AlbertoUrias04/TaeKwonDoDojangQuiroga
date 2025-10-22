namespace Api.Comun.Modelos.Pagos;

public class ModificarPagoDto
{
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public string MetodoPago { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string? Referencia { get; set; }
    public string? Notas { get; set; }

    public int AlumnoId { get; set; }
    public int ConceptoId { get; set; }
    public int? AlumnoInscripcionId { get; set; }
}
