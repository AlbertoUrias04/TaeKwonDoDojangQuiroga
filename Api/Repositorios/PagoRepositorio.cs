using Api.Entidades;
using Api.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositorios;

public class PagoRepositorio : RepositorioGenerico<Pago>, IPagoRepositorio
{
    public PagoRepositorio(AplicacionBdContexto contexto) : base(contexto)
    {
    }

    public async Task<IEnumerable<Pago>> ObtenerConRelacionesAsync(
        int? alumnoId = null,
        int? conceptoId = null,
        string? estado = null,
        DateTime? fechaInicio = null,
        DateTime? fechaFin = null)
    {
        var query = _dbSet
            .Include(p => p.Alumno)
            .Include(p => p.Concepto)
            .Include(p => p.UsuarioRegistro)
            .AsQueryable();

        if (alumnoId.HasValue)
            query = query.Where(p => p.AlumnoId == alumnoId.Value);

        if (conceptoId.HasValue)
            query = query.Where(p => p.ConceptoId == conceptoId.Value);

        if (!string.IsNullOrWhiteSpace(estado))
            query = query.Where(p => p.Estado == estado);

        if (fechaInicio.HasValue)
            query = query.Where(p => p.Fecha >= fechaInicio.Value);

        if (fechaFin.HasValue)
            query = query.Where(p => p.Fecha <= fechaFin.Value);

        return await query.OrderByDescending(p => p.Fecha).ToListAsync();
    }

    public async Task<Pago?> ObtenerPorIdConRelacionesAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Alumno)
            .Include(p => p.Concepto)
            .Include(p => p.UsuarioRegistro)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<int> ContarPorEstadoAsync(string estado, DateTime? fechaInicio = null, DateTime? fechaFin = null)
    {
        var query = _dbSet.Where(p => p.Estado == estado);

        if (fechaInicio.HasValue)
            query = query.Where(p => p.Fecha >= fechaInicio.Value);

        if (fechaFin.HasValue)
            query = query.Where(p => p.Fecha <= fechaFin.Value);

        return await query.CountAsync();
    }

    public async Task<decimal> SumarMontosPorEstadoAsync(string estado, DateTime? fechaInicio = null, DateTime? fechaFin = null)
    {
        var query = _dbSet.Where(p => p.Estado == estado);

        if (fechaInicio.HasValue)
            query = query.Where(p => p.Fecha >= fechaInicio.Value);

        if (fechaFin.HasValue)
            query = query.Where(p => p.Fecha <= fechaFin.Value);

        return await query.SumAsync(p => (decimal?)p.Monto) ?? 0;
    }
}
