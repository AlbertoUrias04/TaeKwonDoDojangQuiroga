using Api.Comun.Modelos.Clases;

namespace Api.Servicios;

public interface IClaseServicio
{
    Task<IEnumerable<BuscarClaseDto>> ObtenerTodasAsync(bool? activo = null, string? tipoClase = null);
    Task<BuscarClaseDto?> ObtenerPorSlugAsync(string slug);
    Task<BuscarClaseDto> CrearAsync(CrearClaseDto dto);
    Task<BuscarClaseDto> ActualizarAsync(string slug, ModificarClaseDto dto);
    Task EliminarAsync(string slug);
}
