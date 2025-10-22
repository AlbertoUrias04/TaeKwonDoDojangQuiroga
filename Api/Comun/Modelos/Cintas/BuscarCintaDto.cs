namespace Api.Comun.Modelos.Cintas;

public class BuscarCintaDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int Orden { get; set; }
    public string ColorHex { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; }
    public string Slug { get; set; } = string.Empty;
}
