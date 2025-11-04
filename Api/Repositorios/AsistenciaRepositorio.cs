using Api.Entidades;
using Api.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositorios;

public class AsistenciaRepositorio : RepositorioGenerico<Asistencia>, IAsistenciaRepositorio
{
    public AsistenciaRepositorio(AplicacionBdContexto contexto) : base(contexto)
    {
    }

    public async Task<List<Asistencia>> ObtenerPorClaseYFecha(int claseId, DateTime fecha)
    {
        var fechaSoloFecha = fecha.Date;
        return await _contexto.Asistencias
            .Include(a => a.Alumno)
            .Include(a => a.Clase)
            .Include(a => a.UsuarioRegistro)
            .Where(a => a.ClaseId == claseId && a.Fecha.Date == fechaSoloFecha)
            .ToListAsync();
    }

    public async Task<List<Asistencia>> ObtenerPorAlumno(int alumnoId)
    {
        return await _contexto.Asistencias
            .Include(a => a.Clase)
            .Include(a => a.UsuarioRegistro)
            .Where(a => a.AlumnoId == alumnoId)
            .OrderByDescending(a => a.Fecha)
            .ToListAsync();
    }

    public async Task<List<Asistencia>> ObtenerPorAlumnoYRangoFechas(int alumnoId, DateTime fechaInicio, DateTime fechaFin)
    {
        return await _contexto.Asistencias
            .Include(a => a.Clase)
            .Include(a => a.UsuarioRegistro)
            .Where(a => a.AlumnoId == alumnoId && a.Fecha.Date >= fechaInicio.Date && a.Fecha.Date <= fechaFin.Date)
            .OrderByDescending(a => a.Fecha)
            .ToListAsync();
    }

    public async Task<int> ContarFaltasPorAlumnoYRango(int alumnoId, DateTime fechaInicio, DateTime fechaFin)
    {
        return await _contexto.Asistencias
            .Where(a => a.AlumnoId == alumnoId
                && !a.Presente
                && a.Fecha.Date >= fechaInicio.Date
                && a.Fecha.Date <= fechaFin.Date)
            .CountAsync();
    }

    public async Task<Asistencia?> ObtenerPorAlumnoClaseYFecha(int alumnoId, int claseId, DateTime fecha)
    {
        var fechaSoloFecha = fecha.Date;
        return await _contexto.Asistencias
            .Include(a => a.Alumno)
            .Include(a => a.Clase)
            .Include(a => a.UsuarioRegistro)
            .FirstOrDefaultAsync(a => a.AlumnoId == alumnoId
                && a.ClaseId == claseId
                && a.Fecha.Date == fechaSoloFecha);
    }

    public async Task<List<Asistencia>> ObtenerTodasConRelaciones()
    {
        return await _contexto.Asistencias
            .Include(a => a.Alumno)
            .Include(a => a.Clase)
            .Include(a => a.UsuarioRegistro)
            .OrderByDescending(a => a.Fecha)
            .ToListAsync();
    }

    public async Task<Asistencia?> ObtenerPorIdConRelaciones(int id)
    {
        return await _contexto.Asistencias
            .Include(a => a.Alumno)
            .Include(a => a.Clase)
            .Include(a => a.UsuarioRegistro)
            .FirstOrDefaultAsync(a => a.Id == id);
    }
}
