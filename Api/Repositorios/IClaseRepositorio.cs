using Api.Entidades;

namespace Api.Repositorios;

public interface IClaseRepositorio : IRepositorioGenerico<Clase>
{
    Task<IEnumerable<Clase>> ObtenerConAlumnosAsync(bool? activo = null, string? tipoClase = null);
    Task<Clase?> ObtenerPorSlugConAlumnosAsync(string slug);
    Task<bool> TieneAlumnosActivosAsync(string slug);
}
