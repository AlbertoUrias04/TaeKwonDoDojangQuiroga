namespace Api.Comun.Modelos.Sucursales;

public class BuscarSucursalDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool Habilitado { get; set; }
}