using Api.Comun.Modelos.Pagos;
using Api.Entidades;
using Api.Repositorios;
using AutoMapper;

namespace Api.Servicios;

public class PagoServicio : IPagoServicio
{
    private readonly IPagoRepositorio _pagoRepositorio;
    private readonly IAlumnoRepositorio _alumnoRepositorio;
    private readonly IConceptoRepositorio _conceptoRepositorio;
    private readonly IMapper _mapper;

    public PagoServicio(
        IPagoRepositorio pagoRepositorio,
        IAlumnoRepositorio alumnoRepositorio,
        IConceptoRepositorio conceptoRepositorio,
        IMapper mapper)
    {
        _pagoRepositorio = pagoRepositorio;
        _alumnoRepositorio = alumnoRepositorio;
        _conceptoRepositorio = conceptoRepositorio;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BuscarPagoDto>> ObtenerTodosAsync(
        int? alumnoId = null,
        int? conceptoId = null,
        string? estado = null,
        DateTime? fechaInicio = null,
        DateTime? fechaFin = null)
    {
        var pagos = await _pagoRepositorio.ObtenerConRelacionesAsync(
            alumnoId, conceptoId, estado, fechaInicio, fechaFin);
        return _mapper.Map<IEnumerable<BuscarPagoDto>>(pagos);
    }

    public async Task<BuscarPagoDto?> ObtenerPorIdAsync(int id)
    {
        var pago = await _pagoRepositorio.ObtenerPorIdConRelacionesAsync(id);
        return pago == null ? null : _mapper.Map<BuscarPagoDto>(pago);
    }

    public async Task<BuscarPagoDto> CrearAsync(CrearPagoDto dto, int usuarioRegistroId)
    {
        // Verificar que el alumno existe
        var alumno = await _alumnoRepositorio.ObtenerPorIdAsync(dto.AlumnoId);
        if (alumno == null)
            throw new KeyNotFoundException("El alumno especificado no existe");

        // Verificar que el concepto existe
        var concepto = await _conceptoRepositorio.ObtenerPorIdAsync(dto.ConceptoId);
        if (concepto == null)
            throw new KeyNotFoundException("El concepto especificado no existe");

        var pago = _mapper.Map<Pago>(dto);
        pago.Estado = "Confirmado";
        pago.UsuarioRegistroId = usuarioRegistroId;

        var pagoCreado = await _pagoRepositorio.AgregarAsync(pago);

        // Cargar relaciones
        var pagoConRelaciones = await _pagoRepositorio.ObtenerPorIdConRelacionesAsync(pagoCreado.Id);
        return _mapper.Map<BuscarPagoDto>(pagoConRelaciones);
    }

    public async Task<BuscarPagoDto> ActualizarAsync(int id, ModificarPagoDto dto)
    {
        var pago = await _pagoRepositorio.ObtenerPorIdAsync(id);
        if (pago == null)
            throw new KeyNotFoundException("Pago no encontrado");

        // Verificar que el alumno existe
        var alumno = await _alumnoRepositorio.ObtenerPorIdAsync(dto.AlumnoId);
        if (alumno == null)
            throw new KeyNotFoundException("El alumno especificado no existe");

        // Verificar que el concepto existe
        var concepto = await _conceptoRepositorio.ObtenerPorIdAsync(dto.ConceptoId);
        if (concepto == null)
            throw new KeyNotFoundException("El concepto especificado no existe");

        _mapper.Map(dto, pago);
        await _pagoRepositorio.ActualizarAsync(pago);

        // Cargar relaciones
        var pagoConRelaciones = await _pagoRepositorio.ObtenerPorIdConRelacionesAsync(id);
        return _mapper.Map<BuscarPagoDto>(pagoConRelaciones);
    }

    public async Task EliminarAsync(int id)
    {
        var pago = await _pagoRepositorio.ObtenerPorIdAsync(id);
        if (pago == null)
            throw new KeyNotFoundException("Pago no encontrado");

        await _pagoRepositorio.EliminarAsync(pago);
    }

    public async Task<object> ObtenerEstadisticasAsync(DateTime? fechaInicio = null, DateTime? fechaFin = null)
    {
        var pagos = await _pagoRepositorio.ObtenerConRelacionesAsync(
            fechaInicio: fechaInicio, fechaFin: fechaFin);

        var totalPagos = pagos.Count();
        var totalMonto = await _pagoRepositorio.SumarMontosPorEstadoAsync("Confirmado", fechaInicio, fechaFin);
        var pagosConfirmados = await _pagoRepositorio.ContarPorEstadoAsync("Confirmado", fechaInicio, fechaFin);
        var pagosPendientes = await _pagoRepositorio.ContarPorEstadoAsync("Pendiente", fechaInicio, fechaFin);
        var pagosRechazados = await _pagoRepositorio.ContarPorEstadoAsync("Rechazado", fechaInicio, fechaFin);

        return new
        {
            TotalPagos = totalPagos,
            TotalMonto = totalMonto,
            PagosConfirmados = pagosConfirmados,
            PagosPendientes = pagosPendientes,
            PagosRechazados = pagosRechazados
        };
    }
}
