using Api.Comun.Modelos.Pagos;

namespace Api.Servicios;

public interface IPagoServicio
{
    Task<IEnumerable<BuscarPagoDto>> ObtenerTodosAsync(
        int? alumnoId = null,
        int? conceptoId = null,
        string? estado = null,
        DateTime? fechaInicio = null,
        DateTime? fechaFin = null);

    Task<BuscarPagoDto?> ObtenerPorIdAsync(int id);
    Task<BuscarPagoDto> CrearAsync(CrearPagoDto dto, int usuarioRegistroId);
    Task<BuscarPagoDto> ActualizarAsync(int id, ModificarPagoDto dto);
    Task EliminarAsync(int id);
    Task<object> ObtenerEstadisticasAsync(DateTime? fechaInicio = null, DateTime? fechaFin = null);
}
