using System.ComponentModel.DataAnnotations;

namespace Api.Comun.Modelos.Socios;

public class CrearSocioDto
{
    [Required(ErrorMessage = "El nombre es requerido")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido paterno es requerido")]
    public string ApellidoPaterno { get; set; } = string.Empty;

    public string? ApellidoMaterno { get; set; }

    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public DateTime? FechaNacimiento { get; set; }
    public string? Direccion { get; set; }
    public bool Habilitado { get; set; } = true;

    public int? SucursalId { get; set; }
}
