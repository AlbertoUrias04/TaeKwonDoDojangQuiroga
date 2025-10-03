namespace Api.Comun.Modelos.Membresias;

public class BuscarMembresiaDto
{
    public string Slug { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public int DuracionDias { get; set; }
    public string? Descripcion { get; set; }
    public bool Activa { get; set; }
}
