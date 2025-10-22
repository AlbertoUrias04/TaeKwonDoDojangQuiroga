using Api.Comun.Interfaces;
using Api.Comun.Modelos;
using Api.Entidades;
using Api.Seguridad;
using Microsoft.EntityFrameworkCore;

namespace Api.Servicios;

public class UsuarioSesionServicioSimple : IUsuariosSesionServicio
{
    private readonly IAplicacionBdContexto _contexto;
    private readonly IHasherServicio _hasherServicio;

    public UsuarioSesionServicioSimple(IAplicacionBdContexto contexto, IHasherServicio hasherServicio)
    {
        _contexto = contexto;
        _hasherServicio = hasherServicio;
    }

    public async Task<SesionUsuario?> IniciarSesionAsync(IniciarSesionVm usuario, CancellationToken cancelacionToken)
    {
        var contrasenaHash = _hasherServicio.GenerarHash(usuario.Contrasena);

        var usuarioEncontrado = await _contexto.Usuarios
            .FirstOrDefaultAsync(u =>
                u.NombreUsuario == usuario.UsuarioNombre &&
                u.Contraseña == contrasenaHash &&
                u.Habilitado, cancelacionToken);

        if (usuarioEncontrado == null)
        {
            return null; // Authentication failed
        }

        // Return a minimal session object just to indicate successful authentication
        // We're not persisting sessions in the database anymore
        return new SesionUsuario
        {
            UsuarioId = usuarioEncontrado.Id,
            Usuario = usuarioEncontrado,
            EsPersistente = usuario.MantenerSesion,
            FechaInicio = DateTime.Now,
            UltimoUso = DateTime.Now,
            Valido = true
        };
    }
}
