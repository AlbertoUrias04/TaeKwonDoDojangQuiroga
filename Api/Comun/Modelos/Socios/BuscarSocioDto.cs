namespace Api.Comun.Modelos.Socios;

public class BuscarSocioDto
{
    public string Slug { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public DateTime? FechaNacimiento { get; set; }
    public string? Direccion { get; set; }
    public bool Habilitado { get; set; }
    public int? SucursalId { get; set; }
    public string NombreSucursal { get; set; } = string.Empty;
    public string? MembresiaActual { get; set; }
    public DateTime? FechaFinMembresia { get; set; }
    public bool MembresiaActiva { get; set; }
}
