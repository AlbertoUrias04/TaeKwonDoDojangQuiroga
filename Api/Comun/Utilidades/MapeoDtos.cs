using Api.Comun.Modelos.Usuarios;
using Api.Comun.Modelos.Socios;
using Api.Comun.Modelos.Membresias;
using Api.Entidades;

namespace Api.Comun.Utilidades;

public static class MapeoDtos
{
    // Mapeo de Usuario (personal del gimnasio)
    public static BuscarUsuariosDto ConvertirDto(this Usuario usuario)
    {
        return new BuscarUsuariosDto()
        {
            Slug = usuario.Slug,
            Nombre = usuario.Nombre,
            ApellidoPaterno = usuario.ApellidoPaterno,
            ApellidoMaterno = usuario.ApellidoMaterno,
            NombreUsuario = usuario.NombreUsuario,
            Habilitado = usuario.Habilitado,
        };
    }

    // Mapeo de Socio (miembros del gimnasio)
    public static BuscarSocioDto ConvertirDto(this Socio socio)
    {
        var membresiaActiva = socio.SocioMembresias?.FirstOrDefault(sm => sm.Activa);

        return new BuscarSocioDto()
        {
            Slug = socio.Slug,
            Nombre = socio.Nombre,
            ApellidoPaterno = socio.ApellidoPaterno,
            ApellidoMaterno = socio.ApellidoMaterno,
            Email = socio.Email,
            Telefono = socio.Telefono,
            FechaNacimiento = socio.FechaNacimiento,
            Direccion = socio.Direccion,
            Habilitado = socio.Activo,
            SucursalId = socio.SucursalId,
            NombreSucursal = socio.Sucursal?.Nombre ?? "",
            MembresiaActual = membresiaActiva?.Membresia?.Nombre,
            FechaFinMembresia = membresiaActiva?.FechaFin,
            MembresiaActiva = membresiaActiva?.Activa ?? false
        };
    }

    // Mapeo de Membresía
    public static BuscarMembresiaDto ConvertirDto(this Membresia membresia)
    {
        return new BuscarMembresiaDto()
        {
            Slug = membresia.Slug,
            Nombre = membresia.Nombre,
            Precio = membresia.Precio,
            DuracionDias = membresia.DuracionDias,
            Descripcion = membresia.Descripcion,
            Activa = membresia.Activa
        };
    }
}