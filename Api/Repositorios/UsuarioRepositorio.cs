using Api.Entidades;
using Api.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositorios;

public class UsuarioRepositorio : RepositorioGenerico<Usuario>, IUsuarioRepositorio
{
    public UsuarioRepositorio(AplicacionBdContexto contexto) : base(contexto)
    {
    }

    public async Task<IEnumerable<Usuario>> BuscarPorNombreYEstadoAsync(string? nombre = null, bool? habilitado = null)
    {
        var query = _dbSet.AsQueryable();

        if (habilitado.HasValue)
        {
            query = query.Where(x => x.Habilitado == habilitado.Value);
        }

        if (!string.IsNullOrEmpty(nombre))
        {
            query = query.Where(x => x.Nombre.Contains(nombre) ||
                                     x.ApellidoPaterno.Contains(nombre) ||
                                     x.ApellidoMaterno.Contains(nombre));
        }

        return await query.ToListAsync();
    }

    public async Task<Usuario?> ObtenerPorNombreUsuarioAsync(string nombreUsuario)
    {
        return await _dbSet.FirstOrDefaultAsync(x => x.NombreUsuario == nombreUsuario);
    }
}
