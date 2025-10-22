using Api.Entidades;
using Api.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositorios;

public class CintaRepositorio : RepositorioGenerico<Cinta>, ICintaRepositorio
{
    public CintaRepositorio(AplicacionBdContexto contexto) : base(contexto)
    {
    }

    public async Task<IEnumerable<Cinta>> ObtenerOrdenadasAsync(bool? activo = null)
    {
        var query = _dbSet.AsQueryable();

        if (activo.HasValue)
        {
            query = query.Where(c => c.Activo == activo.Value);
        }

        return await query.OrderBy(c => c.Orden).ToListAsync();
    }

    public async Task<bool> ExistePorNombreAsync(string nombre, string? slugExcluir = null)
    {
        var query = _dbSet.Where(c => c.Nombre == nombre);

        if (!string.IsNullOrEmpty(slugExcluir))
        {
            query = query.Where(c => c.Slug != slugExcluir);
        }

        return await query.AnyAsync();
    }
}
