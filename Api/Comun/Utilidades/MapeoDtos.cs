using Api.Comun.Modelos.Usuarios;
using Api.Comun.Modelos.Alumnos;
using Api.Entidades;

namespace Api.Comun.Utilidades;

public static class MapeoDtos
{
    // Mapeo para Usuario
    public static BuscarUsuariosDto ConvertirDto(this Usuario usuario)
    {
        return new BuscarUsuariosDto
        {
            Id = usuario.Id,
            Nombre = usuario.Nombre,
            ApellidoPaterno = usuario.ApellidoPaterno,
            ApellidoMaterno = usuario.ApellidoMaterno,
            NombreUsuario = usuario.NombreUsuario,
            Rol = usuario.Rol,
            Habilitado = usuario.Habilitado,
            Slug = usuario.Slug
        };
    }

    // Mapeo para Alumno
    public static BuscarAlumnoDto ConvertirDto(this Alumno alumno)
    {
        var edad = alumno.ObtenerEdad();

        // Construir horario de clase si existe
        string? claseHorario = null;
        if (alumno.Clase != null)
        {
            claseHorario = $"{alumno.Clase.Dias} {alumno.Clase.HoraInicio:hh\\:mm} - {alumno.Clase.HoraFin:hh\\:mm}";
        }

        return new BuscarAlumnoDto
        {
            Id = alumno.Id,
            Nombre = alumno.Nombre,
            ApellidoPaterno = alumno.ApellidoPaterno,
            ApellidoMaterno = alumno.ApellidoMaterno,
            NombreCompleto = $"{alumno.Nombre} {alumno.ApellidoPaterno} {alumno.ApellidoMaterno}",
            FechaNacimiento = alumno.FechaNacimiento,
            Edad = edad,
            Direccion = alumno.Direccion,
            Sexo = alumno.Sexo,
            NombreTutor = alumno.NombreTutor,
            TelefonoTutor = alumno.TelefonoTutor,
            EmailTutor = alumno.EmailTutor,
            CintaActualId = alumno.CintaActualId,
            CintaActualNombre = alumno.CintaActual?.Nombre,
            CintaActualColor = alumno.CintaActual?.ColorHex,
            ClaseId = alumno.ClaseId,
            ClaseNombre = alumno.Clase?.Nombre,
            ClaseHorario = claseHorario,
            ConceptoMensualidadId = alumno.ConceptoMensualidadId,
            ConceptoMensualidadNombre = alumno.ConceptoMensualidad?.Nombre,
            ConceptoMensualidadMonto = alumno.ConceptoMensualidad?.Precio,
            Activo = alumno.Activo,
            FechaInscripcion = alumno.FechaInscripcion,
            Slug = alumno.Slug
        };
    }

    // TODO: Agregar mapeos para Cinta, Clase, Concepto, Pago, etc.
}
