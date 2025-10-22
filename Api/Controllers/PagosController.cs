using Api.Comun.Modelos.Pagos;
using Api.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("pagos")]
[Route("v1/pagos")]
public class PagosController : ControllerBase
{
    private readonly IPagoServicio _pagoServicio;

    public PagosController(IPagoServicio pagoServicio)
    {
        _pagoServicio = pagoServicio;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BuscarPagoDto>>> ObtenerPagos(
        [FromQuery] int? alumnoId = null,
        [FromQuery] int? conceptoId = null,
        [FromQuery] string? estado = null,
        [FromQuery] DateTime? fechaInicio = null,
        [FromQuery] DateTime? fechaFin = null)
    {
        var pagos = await _pagoServicio.ObtenerTodosAsync(alumnoId, conceptoId, estado, fechaInicio, fechaFin);
        return Ok(pagos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BuscarPagoDto>> ObtenerPago(int id)
    {
        var pago = await _pagoServicio.ObtenerPorIdAsync(id);

        if (pago == null)
            return NotFound();

        return Ok(pago);
    }

    [HttpPost]
    public async Task<ActionResult<BuscarPagoDto>> CrearPago([FromBody] CrearPagoDto dto)
    {
        // TODO: Obtener usuario actual del contexto del usuario autenticado
        var usuarioId = 1;

        var pagoCreado = await _pagoServicio.CrearAsync(dto, usuarioId);
        return CreatedAtAction(nameof(ObtenerPago), new { id = pagoCreado.Id }, pagoCreado);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BuscarPagoDto>> ActualizarPago(int id, [FromBody] ModificarPagoDto dto)
    {
        var pagoActualizado = await _pagoServicio.ActualizarAsync(id, dto);
        return Ok(pagoActualizado);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> EliminarPago(int id)
    {
        await _pagoServicio.EliminarAsync(id);
        return NoContent();
    }

    [HttpGet("estadisticas")]
    public async Task<ActionResult<object>> ObtenerEstadisticas(
        [FromQuery] DateTime? fechaInicio = null,
        [FromQuery] DateTime? fechaFin = null)
    {
        var estadisticas = await _pagoServicio.ObtenerEstadisticasAsync(fechaInicio, fechaFin);
        return Ok(estadisticas);
    }
}
