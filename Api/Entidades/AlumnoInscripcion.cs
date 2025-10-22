using System.Text.Json.Serialization;

namespace Api.Entidades;

public class AlumnoInscripcion
{
    public int Id { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public bool Activa { get; set; } = true;

    public int AlumnoId { get; set; }
    [JsonIgnore]
    public virtual Alumno Alumno { get; set; } = null!;

    public int ConceptoId { get; set; }
    [JsonIgnore]
    public virtual Concepto Concepto { get; set; } = null!;

    public virtual ICollection<Pago> Pagos { get; set; } = new List<Pago>();
}
