using Api.Entidades;

namespace Api.Repositorios;

public interface ICintaRepositorio : IRepositorioGenerico<Cinta>
{
    Task<IEnumerable<Cinta>> ObtenerOrdenadasAsync(bool? activo = null);
    Task<bool> ExistePorNombreAsync(string nombre, string? slugExcluir = null);
}
