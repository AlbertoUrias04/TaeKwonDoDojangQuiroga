using Api.Comun.Modelos.Conceptos;

namespace Api.Servicios;

public interface IConceptoServicio
{
    Task<IEnumerable<BuscarConceptoDto>> ObtenerTodosAsync(bool? activo = null, string? tipoConcepto = null);
    Task<BuscarConceptoDto?> ObtenerPorSlugAsync(string slug);
    Task<BuscarConceptoDto> CrearAsync(CrearConceptoDto dto);
    Task<BuscarConceptoDto> ActualizarAsync(string slug, ModificarConceptoDto dto);
    Task DesactivarAsync(string slug);
}
