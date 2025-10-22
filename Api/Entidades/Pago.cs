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
    public string? Notas { get; set; } // Para agregar información adicional (ej: "Aprobó examen Cinta Azul")

    public int AlumnoId { get; set; }
    [JsonIgnore]
    public virtual Alumno Alumno { get; set; } = null!;

    public int ConceptoId { get; set; }
    [JsonIgnore]
    public virtual Concepto Concepto { get; set; } = null!;

    public int? AlumnoInscripcionId { get; set; } // Nullable: solo aplica para pagos de mensualidad
    [JsonIgnore]
    public virtual AlumnoInscripcion? AlumnoInscripcion { get; set; }

    public int UsuarioRegistroId { get; set; }
    [JsonIgnore]
    public virtual Usuario UsuarioRegistro { get; set; } = null!;
}
