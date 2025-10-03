using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Entidades;

public class Asistencia
{
    public int Id { get; set; }
    public DateTime FechaHoraEntrada { get; set; }
    public DateTime? FechaHoraSalida { get; set; }

    public int SocioId { get; set; }
    [JsonIgnore]
    public virtual Socio Socio { get; set; } = null!;

    public int SucursalId { get; set; }
    [JsonIgnore]
    public virtual Sucursal Sucursal { get; set; } = null!;
}
