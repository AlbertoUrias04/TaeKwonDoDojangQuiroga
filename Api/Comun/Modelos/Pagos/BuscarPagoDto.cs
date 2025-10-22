namespace Api.Comun.Modelos.Pagos;

public class BuscarPagoDto
{
    public int Id { get; set; }
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public string MetodoPago { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string? Referencia { get; set; }
    public string? Notas { get; set; }

    // Información del alumno
    public int AlumnoId { get; set; }
    public string AlumnoNombre { get; set; } = string.Empty;

    // Información del concepto
    public int ConceptoId { get; set; }
    public string ConceptoNombre { get; set; } = string.Empty;
    public string TipoConcepto { get; set; } = string.Empty;

    // Información del usuario que registró
    public int UsuarioRegistroId { get; set; }
    public string UsuarioRegistroNombre { get; set; } = string.Empty;

    public int? AlumnoInscripcionId { get; set; }
}
