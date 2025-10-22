using Api.Entidades;
using Api.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositorios;

public class AlumnoRepositorio : RepositorioGenerico<Alumno>, IAlumnoRepositorio
{
    public AlumnoRepositorio(AplicacionBdContexto contexto) : base(contexto)
    {
    }

    public async Task<IEnumerable<Alumno>> ObtenerConInscripcionesAsync()
    {
        return await _dbSet
            .Include(a => a.CintaActual)
            .Include(a => a.Clase)
            .Include(a => a.ConceptoMensualidad)
            .OrderBy(a => a.Nombre)
            .ThenBy(a => a.ApellidoPaterno)
            .ToListAsync();
    }

    public async Task<Alumno?> ObtenerPorSlugConInscripcionesAsync(string slug)
    {
        return await _dbSet
            .Include(a => a.CintaActual)
            .Include(a => a.Clase)
            .Include(a => a.ConceptoMensualidad)
            .FirstOrDefaultAsync(a => a.Slug == slug);
    }

    public async Task<bool> ExistePorEmailAsync(string email, string? slugExcluir = null)
    {
        var query = _dbSet.Where(a => a.EmailTutor == email);

        if (!string.IsNullOrEmpty(slugExcluir))
        {
            query = query.Where(a => a.Slug != slugExcluir);
        }

        return await query.AnyAsync();
    }

    public async Task<bool> ExistePorTelefonoAsync(string telefono, string? slugExcluir = null)
    {
        var query = _dbSet.Where(a => a.TelefonoTutor == telefono);

        if (!string.IsNullOrEmpty(slugExcluir))
        {
            query = query.Where(a => a.Slug != slugExcluir);
        }

        return await query.AnyAsync();
    }

    public async Task<IEnumerable<Alumno>> BuscarConFiltrosAsync(
        int? cintaId = null,
        int? claseId = null,
        int? conceptoId = null,
        bool? activo = null,
        int? edadMinima = null,
        int? edadMaxima = null)
    {
        var query = _dbSet
            .Include(a => a.CintaActual)
            .Include(a => a.Clase)
            .Include(a => a.ConceptoMensualidad)
            .AsQueryable();

        if (cintaId.HasValue)
        {
            query = query.Where(a => a.CintaActualId == cintaId.Value);
        }

        if (claseId.HasValue)
        {
            query = query.Where(a => a.ClaseId == claseId.Value);
        }

        if (conceptoId.HasValue)
        {
            query = query.Where(a => a.ConceptoMensualidadId == conceptoId.Value);
        }

        if (activo.HasValue)
        {
            query = query.Where(a => a.Activo == activo.Value);
        }

        if (edadMinima.HasValue || edadMaxima.HasValue)
        {
            var hoy = DateTime.Now;

            if (edadMinima.HasValue)
            {
                var fechaMaxNacimiento = hoy.AddYears(-edadMinima.Value);
                query = query.Where(a => a.FechaNacimiento <= fechaMaxNacimiento);
            }

            if (edadMaxima.HasValue)
            {
                var fechaMinNacimiento = hoy.AddYears(-edadMaxima.Value - 1);
                query = query.Where(a => a.FechaNacimiento > fechaMinNacimiento);
            }
        }

        return await query
            .OrderBy(a => a.Nombre)
            .ThenBy(a => a.ApellidoPaterno)
            .ToListAsync();
    }
}
