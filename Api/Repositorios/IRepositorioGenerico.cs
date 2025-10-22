using System.Linq.Expressions;

namespace Api.Repositorios;

public interface IRepositorioGenerico<T> where T : class
{
    Task<T?> ObtenerPorIdAsync(int id);
    Task<T?> ObtenerPorSlugAsync(string slug);
    Task<IEnumerable<T>> ObtenerTodosAsync();
    Task<IEnumerable<T>> BuscarAsync(Expression<Func<T, bool>> predicado);
    Task<T> AgregarAsync(T entidad);
    Task ActualizarAsync(T entidad);
    Task EliminarAsync(T entidad);
    Task<bool> ExisteAsync(Expression<Func<T, bool>> predicado);
    Task<int> ContarAsync(Expression<Func<T, bool>>? predicado = null);
}
