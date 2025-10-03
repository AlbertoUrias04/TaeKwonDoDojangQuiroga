using Api.Comun.Interfaces;
using Microsoft.EntityFrameworkCore;
using Api.Comun.Modelos;
using Api.Entidades;
using Api.Seguridad;
using Api.Comun.Modelos.Usuarios;

namespace Api.Servicios;

public class UsuarioSesionServicio : IUsuariosSesionServicio
{
    private readonly IAplicacionBdContexto _contexto;
    private readonly IHasherServicio _hasherServicio;

    public UsuarioSesionServicio(IAplicacionBdContexto contexto, IHasherServicio hasherServicio)
    {
        _contexto = contexto;
        _hasherServicio = hasherServicio;
    }

    public async Task<SesionUsuario?> IniciarSesionAsync(IniciarSesionVm inicioSesion, CancellationToken cancelacionToken)
    {
        // Buscar usuario por nombre de usuario
        var usuario = await _contexto.Usuarios
            .FirstOrDefaultAsync(u =>
                u.NombreUsuario == inicioSesion.UsuarioNombre &&
                u.Habilitado,
                cancelacionToken);

        // Si no lo encontró, regresar null
        if (usuario == null)
            return null;

        // Verificar contraseña hasheada
        var contraseñaHasheada = _hasherServicio.GenerarHash(inicioSesion.Contrasena);
        if (usuario.Contraseña != contraseñaHasheada)
            return null;

        // Crear nueva sesión
        var nuevaSesion = new SesionUsuario
        {
            EsPersistente = inicioSesion.MantenerSesion,
            FechaInicio = DateTime.UtcNow,
            UsuarioId = usuario.Id,
            UltimoUso = DateTime.UtcNow,
            Valido = true
        };

        _contexto.SesionesUsuario.Add(nuevaSesion);
        await _contexto.SaveChangesAsync(cancelacionToken); // usa tu método async si lo tienes

        return nuevaSesion;
    }
}