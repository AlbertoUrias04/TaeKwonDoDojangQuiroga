using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Entidades;

public class SocioMembresia
{
    public int Id { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public bool Activa { get; set; }

    public int SocioId { get; set; }
    [JsonIgnore]
    public virtual Socio Socio { get; set; } = null!;

    public int MembresiaId { get; set; }
    [JsonIgnore]
    public virtual Membresia Membresia { get; set; } = null!;

    public virtual List<Pago> Pagos { get; set; } = new List<Pago>();
}
