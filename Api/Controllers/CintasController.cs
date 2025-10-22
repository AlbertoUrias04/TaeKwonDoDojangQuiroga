using Api.Comun.Modelos.Cintas;
using Api.Servicios;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("cintas")]
[Route("v{version:apiVersion}/cintas")]
public class CintasController : ControllerBase
{
    private readonly ICintaServicio _cintaServicio;

    public CintasController(ICintaServicio cintaServicio)
    {
        _cintaServicio = cintaServicio;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BuscarCintaDto>>> ObtenerCintas([FromQuery] bool? activo = null)
    {
        var cintas = await _cintaServicio.ObtenerTodasAsync(activo);
        return Ok(cintas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BuscarCintaDto>> ObtenerCintaPorId(int id)
    {
        var cinta = await _cintaServicio.ObtenerPorIdAsync(id);

        if (cinta == null)
        {
            return NotFound(new { mensaje = "Cinta no encontrada" });
        }

        return Ok(cinta);
    }
}
