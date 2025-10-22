using Api.Entidades;
using Api.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositorios;

public class ClaseRepositorio : RepositorioGenerico<Clase>, IClaseRepositorio
{
    public ClaseRepositorio(AplicacionBdContexto contexto) : base(contexto)
    {
    }

    public async Task<IEnumerable<Clase>> ObtenerConAlumnosAsync(bool? activo = null, string? tipoClase = null)
    {
        var query = _dbSet.Include(c => c.Alumnos).AsQueryable();

        if (activo.HasValue)
        {
            query = query.Where(c => c.Activo == activo.Value);
        }

        if (!string.IsNullOrEmpty(tipoClase))
        {
            query = query.Where(c => c.TipoClase.ToLower() == tipoClase.ToLower());
        }

        return await query.OrderBy(c => c.HoraInicio).ToListAsync();
    }

    public async Task<Clase?> ObtenerPorSlugConAlumnosAsync(string slug)
    {
        return await _dbSet
            .Include(c => c.Alumnos)
            .FirstOrDefaultAsync(c => c.Slug == slug);
    }

    public async Task<bool> TieneAlumnosActivosAsync(string slug)
    {
        var clase = await _dbSet
            .Include(c => c.Alumnos)
            .FirstOrDefaultAsync(c => c.Slug == slug);

        if (clase == null)
            return false;

        return clase.Alumnos.Any(a => a.Activo);
    }
}
