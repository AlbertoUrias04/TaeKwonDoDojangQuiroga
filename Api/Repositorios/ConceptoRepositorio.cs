using Api.Entidades;
using Api.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositorios;

public class ConceptoRepositorio : RepositorioGenerico<Concepto>, IConceptoRepositorio
{
    public ConceptoRepositorio(AplicacionBdContexto contexto) : base(contexto)
    {
    }

    public async Task<IEnumerable<Concepto>> ObtenerOrdenadasAsync(bool? activo = null, string? tipoConcepto = null)
    {
        var query = _dbSet.AsQueryable();

        if (activo.HasValue)
        {
            query = query.Where(c => c.Activo == activo.Value);
        }

        if (!string.IsNullOrEmpty(tipoConcepto))
        {
            query = query.Where(c => c.TipoConcepto.ToLower() == tipoConcepto.ToLower());
        }

        return await query.OrderBy(c => c.TipoConcepto).ThenBy(c => c.Nombre).ToListAsync();
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
