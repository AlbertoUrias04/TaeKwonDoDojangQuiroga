using Api.Comun.Interfaces;
using Api.Comun.Modelos.Usuarios;
using Api.Comun.Utilidades;
using Api.Entidades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Authorize]
[Route("usuarios")]
public class UsuariosController: ControllerBase
{
    private readonly IAplicacionBdContexto _contexto;
    private readonly IHasherServicio _hasherServicio;
    
    public UsuariosController(IAplicacionBdContexto contexto,
        IHasherServicio hasherServicio)
    {
        _contexto = contexto;
        _hasherServicio = hasherServicio;
    }

    [HttpGet]
    public async Task<List<BuscarUsuariosDto>> ObtenerUsuarios(string nombre, bool? habilitado)
    {
        var query = _contexto.Usuarios.AsQueryable();

        if (habilitado.HasValue)
        {
            query = query.Where(x => x.Habilitado == habilitado.Value);
        }

        if (string.IsNullOrEmpty(nombre) == false)
        {
            query = query.Where(x => x.Nombre.Contains(nombre) ||
                                     x.ApellidoPaterno.Contains(nombre) ||
                                     x.ApellidoMaterno.Contains(nombre));
        }
        var lista = await query.ToListAsync();
        
        return lista.ConvertAll(x => x.ConvertirDto());
    }
    
    [HttpGet("{slug}")]
    public async Task<BuscarUsuariosDto> ObtenerUsuarios(string slug, CancellationToken cancelacionToken)
    {
        var usuario = await _contexto.Usuarios.FirstOrDefaultAsync(x => x.Slug == slug, cancelacionToken);
        
        if(usuario == null)
            return new BuscarUsuariosDto();
        
        return usuario.ConvertirDto();
    }

    [HttpPost]
    public async Task<string> RegistrarUsuario([FromBody] CrearUsuarioDto usuario, CancellationToken cancelacionToken)
    {
        var contraseñaEncriptada = _hasherServicio.GenerarHash(usuario.Contraseña);

        var nuevoUsuario = new Usuario()
        {
            Nombre = usuario.Nombre,
            ApellidoPaterno = usuario.ApellidoPaterno,
            ApellidoMaterno = usuario.ApellidoMaterno,
            NombreUsuario = usuario.NombreUsuario,
            Contraseña = contraseñaEncriptada,
            Habilitado = usuario.Habilitado,
        };
        await _contexto.Usuarios.AddAsync(nuevoUsuario, cancelacionToken);
        await _contexto.SaveChangesAsync(cancelacionToken);
        
        return nuevoUsuario.Slug;
    }

    [HttpPut("{slug}")]
    public async Task<BuscarUsuariosDto> ModificarUsuario([FromBody] ModificarUsuarioDto usuarioDto,
        CancellationToken cancelacionToken)
    {
        var usuario = await _contexto.Usuarios
            .FirstOrDefaultAsync(x => x.Slug == usuarioDto.Slug, cancelacionToken);

        if (usuario == null)
            return new BuscarUsuariosDto();
        
        usuario.Nombre = usuarioDto.Nombre;
        usuario.ApellidoPaterno = usuarioDto.ApellidoPaterno;
        usuario.ApellidoMaterno = usuarioDto.ApellidoMaterno;
        usuario.NombreUsuario = usuarioDto.NombreUsuario;
        usuario.Habilitado = usuarioDto.Habilitado;

        if (string.IsNullOrEmpty(usuarioDto.Contraseña) == false)
        {
            usuario.Contraseña = _hasherServicio.GenerarHash(usuarioDto.Contraseña);
        }
        
        await _contexto.SaveChangesAsync(cancelacionToken);
        
        return usuario.ConvertirDto();
    }

    [HttpPatch("{slug}")]
    public async Task<bool> CambiarHabilitado(string slug, [FromBody] HabilitadoUsuarioDto usuario,
        CancellationToken cancelacionToken)
    {
        var entidad = await _contexto.Usuarios.FirstOrDefaultAsync(x => x.Slug == slug, cancelacionToken);

        if (entidad == null)
            return false;

        entidad.Habilitado = usuario.Habilitado;
        
        await _contexto.SaveChangesAsync(cancelacionToken);
        
        return true;
    }
}