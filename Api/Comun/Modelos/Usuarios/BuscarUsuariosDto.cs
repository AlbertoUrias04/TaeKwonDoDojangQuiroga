namespace Api.Comun.Modelos.Usuarios;

public class BuscarUsuariosDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public string NombreUsuario { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public bool Habilitado { get; set; }
}