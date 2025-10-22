using Api.Comun.Interfaces;
using Api.Comun.Modelos.Usuarios;
using Api.Entidades;
using Api.Repositorios;
using AutoMapper;

namespace Api.Servicios;

public class UsuarioServicio : IUsuarioServicio
{
    private readonly IUsuarioRepositorio _usuarioRepositorio;
    private readonly IHasherServicio _hasherServicio;
    private readonly IMapper _mapper;

    public UsuarioServicio(
        IUsuarioRepositorio usuarioRepositorio,
        IHasherServicio hasherServicio,
        IMapper mapper)
    {
        _usuarioRepositorio = usuarioRepositorio;
        _hasherServicio = hasherServicio;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BuscarUsuariosDto>> ObtenerTodosAsync(string? nombre = null, bool? habilitado = null)
    {
        var usuarios = await _usuarioRepositorio.BuscarPorNombreYEstadoAsync(nombre, habilitado);
        return _mapper.Map<IEnumerable<BuscarUsuariosDto>>(usuarios);
    }

    public async Task<BuscarUsuariosDto?> ObtenerPorSlugAsync(string slug)
    {
        var usuario = await _usuarioRepositorio.ObtenerPorSlugAsync(slug);
        return usuario == null ? null : _mapper.Map<BuscarUsuariosDto>(usuario);
    }

    public async Task<string> CrearAsync(CrearUsuarioDto dto)
    {
        // Verificar que el nombre de usuario no exista
        var usuarioExistente = await _usuarioRepositorio.ObtenerPorNombreUsuarioAsync(dto.NombreUsuario);
        if (usuarioExistente != null)
            throw new InvalidOperationException("El nombre de usuario ya existe");

        var usuario = _mapper.Map<Usuario>(dto);
        usuario.Contraseña = _hasherServicio.GenerarHash(dto.Contraseña);

        var usuarioCreado = await _usuarioRepositorio.AgregarAsync(usuario);
        return usuarioCreado.Slug;
    }

    public async Task<BuscarUsuariosDto?> ActualizarAsync(ModificarUsuarioDto dto)
    {
        var usuario = await _usuarioRepositorio.ObtenerPorSlugAsync(dto.Slug);
        if (usuario == null)
            return null;

        // Verificar que el nombre de usuario no exista en otro usuario
        if (usuario.NombreUsuario != dto.NombreUsuario)
        {
            var usuarioExistente = await _usuarioRepositorio.ObtenerPorNombreUsuarioAsync(dto.NombreUsuario);
            if (usuarioExistente != null)
                throw new InvalidOperationException("El nombre de usuario ya existe");
        }

        _mapper.Map(dto, usuario);

        if (!string.IsNullOrEmpty(dto.Contraseña))
        {
            usuario.Contraseña = _hasherServicio.GenerarHash(dto.Contraseña);
        }

        await _usuarioRepositorio.ActualizarAsync(usuario);
        return _mapper.Map<BuscarUsuariosDto>(usuario);
    }

    public async Task<bool> CambiarHabilitadoAsync(string slug, bool habilitado)
    {
        var usuario = await _usuarioRepositorio.ObtenerPorSlugAsync(slug);
        if (usuario == null)
            return false;

        usuario.Habilitado = habilitado;
        await _usuarioRepositorio.ActualizarAsync(usuario);
        return true;
    }
}
