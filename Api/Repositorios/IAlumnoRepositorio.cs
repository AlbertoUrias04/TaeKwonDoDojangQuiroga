using Api.Entidades;

namespace Api.Repositorios;

public interface IAlumnoRepositorio : IRepositorioGenerico<Alumno>
{
    Task<IEnumerable<Alumno>> ObtenerConInscripcionesAsync();
    Task<Alumno?> ObtenerPorSlugConInscripcionesAsync(string slug);
    Task<bool> ExistePorEmailAsync(string email, string? slugExcluir = null);
    Task<bool> ExistePorTelefonoAsync(string telefono, string? slugExcluir = null);
    Task<IEnumerable<Alumno>> BuscarConFiltrosAsync(
        int? cintaId = null,
        int? claseId = null,
        int? conceptoId = null,
        bool? activo = null,
        int? edadMinima = null,
        int? edadMaxima = null);
}
