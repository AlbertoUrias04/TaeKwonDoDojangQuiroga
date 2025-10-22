using Api.Entidades;

namespace Api.Repositorios;

public interface IConceptoRepositorio : IRepositorioGenerico<Concepto>
{
    Task<IEnumerable<Concepto>> ObtenerOrdenadasAsync(bool? activo = null, string? tipoConcepto = null);
    Task<bool> ExistePorNombreAsync(string nombre, string? slugExcluir = null);
}
