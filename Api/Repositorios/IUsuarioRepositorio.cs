using Api.Entidades;

namespace Api.Repositorios;

public interface IUsuarioRepositorio : IRepositorioGenerico<Usuario>
{
    Task<IEnumerable<Usuario>> BuscarPorNombreYEstadoAsync(string? nombre = null, bool? habilitado = null);
    Task<Usuario?> ObtenerPorNombreUsuarioAsync(string nombreUsuario);
}
