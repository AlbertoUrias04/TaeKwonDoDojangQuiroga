using Api.Comun.Modelos.Cintas;

namespace Api.Servicios;

public interface ICintaServicio
{
    Task<IEnumerable<BuscarCintaDto>> ObtenerTodasAsync(bool? activo = null);
    Task<BuscarCintaDto?> ObtenerPorIdAsync(int id);
    Task<BuscarCintaDto?> ObtenerPorSlugAsync(string slug);
}
