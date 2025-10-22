using Api.Comun.Modelos.Clases;
using Api.Servicios;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("clases")]
[Route("v{version:apiVersion}/clases")]
public class ClasesController : ControllerBase
{
    private readonly IClaseServicio _claseServicio;

    public ClasesController(IClaseServicio claseServicio)
    {
        _claseServicio = claseServicio;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BuscarClaseDto>>> ObtenerClases(
        [FromQuery] bool? activo = null,
        [FromQuery] string? tipoClase = null)
    {
        var clases = await _claseServicio.ObtenerTodasAsync(activo, tipoClase);
        return Ok(clases);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<BuscarClaseDto>> ObtenerClasePorSlug(string slug)
    {
        var clase = await _claseServicio.ObtenerPorSlugAsync(slug);

        if (clase == null)
        {
            return NotFound(new { mensaje = "Clase no encontrada" });
        }

        return Ok(clase);
    }

    [HttpPost]
    public async Task<ActionResult<BuscarClaseDto>> CrearClase([FromBody] CrearClaseDto dto)
    {
        var clase = await _claseServicio.CrearAsync(dto);
        return CreatedAtAction(nameof(ObtenerClasePorSlug), new { slug = clase.Slug }, clase);
    }

    [HttpPut("{slug}")]
    public async Task<ActionResult<BuscarClaseDto>> ActualizarClase(
        string slug,
        [FromBody] ModificarClaseDto dto)
    {
        if (slug != dto.Slug)
        {
            return BadRequest(new { mensaje = "El slug no coincide" });
        }

        var clase = await _claseServicio.ActualizarAsync(slug, dto);
        return Ok(clase);
    }

    [HttpDelete("{slug}")]
    public async Task<ActionResult> EliminarClase(string slug)
    {
        await _claseServicio.EliminarAsync(slug);
        return Ok(new { mensaje = "Clase eliminada exitosamente" });
    }
}
