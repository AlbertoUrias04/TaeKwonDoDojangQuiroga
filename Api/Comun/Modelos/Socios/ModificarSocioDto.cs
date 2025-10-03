using System.ComponentModel.DataAnnotations;

namespace Api.Comun.Modelos.Socios;

public class ModificarSocioDto
{
    [Required]
    public string Slug { get; set; } = string.Empty;

    [Required]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    public string ApellidoPaterno { get; set; } = string.Empty;

    public string ApellidoMaterno { get; set; } = string.Empty;

    [EmailAddress]
    public string? Email { get; set; }

    public string? Telefono { get; set; }

    public DateTime? FechaNacimiento { get; set; }

    public string? Direccion { get; set; }
    public bool Habilitado { get; set; }

    public int? SucursalId { get; set; }
}
