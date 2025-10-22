using Api.Comun.Modelos.Conceptos;
using Api.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[Route("conceptos")]
[Route("v1/conceptos")]
public class ConceptosController : ControllerBase
{
    private readonly IConceptoServicio _conceptoServicio;

    public ConceptosController(IConceptoServicio conceptoServicio)
    {
        _conceptoServicio = conceptoServicio;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BuscarConceptoDto>>> ObtenerConceptos(
        [FromQuery] bool? activo = null,
        [FromQuery] string? tipoConcepto = null)
    {
        var conceptos = await _conceptoServicio.ObtenerTodosAsync(activo, tipoConcepto);
        return Ok(conceptos);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<BuscarConceptoDto>> ObtenerConceptoPorSlug(string slug)
    {
        var concepto = await _conceptoServicio.ObtenerPorSlugAsync(slug);

        if (concepto == null)
        {
            return NotFound(new { mensaje = "Concepto no encontrado" });
        }

        return Ok(concepto);
    }

    [HttpPost]
    public async Task<ActionResult<BuscarConceptoDto>> CrearConcepto([FromBody] CrearConceptoDto dto)
    {
        var conceptoCreado = await _conceptoServicio.CrearAsync(dto);
        return CreatedAtAction(nameof(ObtenerConceptoPorSlug), new { slug = conceptoCreado.Slug }, conceptoCreado);
    }

    [HttpPut("{slug}")]
    public async Task<ActionResult<BuscarConceptoDto>> ActualizarConcepto(
        string slug,
        [FromBody] ModificarConceptoDto dto)
    {
        if (slug != dto.Slug)
        {
            return BadRequest(new { mensaje = "El slug no coincide" });
        }

        var conceptoActualizado = await _conceptoServicio.ActualizarAsync(slug, dto);
        return Ok(conceptoActualizado);
    }

    [HttpDelete("{slug}")]
    public async Task<ActionResult> EliminarConcepto(string slug)
    {
        await _conceptoServicio.DesactivarAsync(slug);
        return Ok(new { mensaje = "Concepto desactivado correctamente" });
    }
}
