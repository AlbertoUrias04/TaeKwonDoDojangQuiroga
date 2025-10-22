using Api.Comun.Modelos.Usuarios;
using Api.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[Route("usuarios")]
[Route("v1/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioServicio _usuarioServicio;

    public UsuariosController(IUsuarioServicio usuarioServicio)
    {
        _usuarioServicio = usuarioServicio;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BuscarUsuariosDto>>> ObtenerUsuarios(
        [FromQuery] string? nombre = null,
        [FromQuery] bool? habilitado = null)
    {
        var usuarios = await _usuarioServicio.ObtenerTodosAsync(nombre, habilitado);
        return Ok(usuarios);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<BuscarUsuariosDto>> ObtenerUsuario(string slug)
    {
        var usuario = await _usuarioServicio.ObtenerPorSlugAsync(slug);

        if (usuario == null)
            return NotFound(new { mensaje = "Usuario no encontrado" });

        return Ok(usuario);
    }

    [HttpPost]
    public async Task<ActionResult<string>> RegistrarUsuario([FromBody] CrearUsuarioDto dto)
    {
        var slug = await _usuarioServicio.CrearAsync(dto);
        return CreatedAtAction(nameof(ObtenerUsuario), new { slug }, new { slug });
    }

    [HttpPut("{slug}")]
    public async Task<ActionResult<BuscarUsuariosDto>> ModificarUsuario(
        string slug,
        [FromBody] ModificarUsuarioDto dto)
    {
        if (slug != dto.Slug)
            return BadRequest(new { mensaje = "El slug no coincide" });

        var usuarioActualizado = await _usuarioServicio.ActualizarAsync(dto);

        if (usuarioActualizado == null)
            return NotFound(new { mensaje = "Usuario no encontrado" });

        return Ok(usuarioActualizado);
    }

    [HttpPatch("{slug}")]
    public async Task<ActionResult<bool>> CambiarHabilitado(
        string slug,
        [FromBody] HabilitadoUsuarioDto dto)
    {
        var resultado = await _usuarioServicio.CambiarHabilitadoAsync(slug, dto.Habilitado);

        if (!resultado)
            return NotFound(new { mensaje = "Usuario no encontrado" });

        return Ok(new { mensaje = "Estado actualizado correctamente", habilitado = dto.Habilitado });
    }
}
