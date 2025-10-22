using Api.Entidades;

namespace Api.Repositorios;

public interface IPagoRepositorio : IRepositorioGenerico<Pago>
{
    Task<IEnumerable<Pago>> ObtenerConRelacionesAsync(
        int? alumnoId = null,
        int? conceptoId = null,
        string? estado = null,
        DateTime? fechaInicio = null,
        DateTime? fechaFin = null);

    Task<Pago?> ObtenerPorIdConRelacionesAsync(int id);
    Task<int> ContarPorEstadoAsync(string estado, DateTime? fechaInicio = null, DateTime? fechaFin = null);
    Task<decimal> SumarMontosPorEstadoAsync(string estado, DateTime? fechaInicio = null, DateTime? fechaFin = null);
}
