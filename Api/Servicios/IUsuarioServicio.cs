using Api.Comun.Modelos.Usuarios;

namespace Api.Servicios;

public interface IUsuarioServicio
{
    Task<IEnumerable<BuscarUsuariosDto>> ObtenerTodosAsync(string? nombre = null, bool? habilitado = null);
    Task<BuscarUsuariosDto?> ObtenerPorSlugAsync(string slug);
    Task<string> CrearAsync(CrearUsuarioDto dto);
    Task<BuscarUsuariosDto?> ActualizarAsync(ModificarUsuarioDto dto);
    Task<bool> CambiarHabilitadoAsync(string slug, bool habilitado);
}
