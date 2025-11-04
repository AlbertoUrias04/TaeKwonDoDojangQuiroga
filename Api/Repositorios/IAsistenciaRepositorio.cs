using Api.Entidades;

namespace Api.Repositorios;

public interface IAsistenciaRepositorio : IRepositorioGenerico<Asistencia>
{
    Task<List<Asistencia>> ObtenerPorClaseYFecha(int claseId, DateTime fecha);
    Task<List<Asistencia>> ObtenerPorAlumno(int alumnoId);
    Task<List<Asistencia>> ObtenerPorAlumnoYRangoFechas(int alumnoId, DateTime fechaInicio, DateTime fechaFin);
    Task<int> ContarFaltasPorAlumnoYRango(int alumnoId, DateTime fechaInicio, DateTime fechaFin);
    Task<Asistencia?> ObtenerPorAlumnoClaseYFecha(int alumnoId, int claseId, DateTime fecha);
    Task<List<Asistencia>> ObtenerTodasConRelaciones();
    Task<Asistencia?> ObtenerPorIdConRelaciones(int id);
}
