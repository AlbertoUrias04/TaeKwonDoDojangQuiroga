namespace Api.Comun.Modelos.Clases;

public class BuscarClaseDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Dias { get; set; } = string.Empty;
    public string HoraInicio { get; set; } = string.Empty;
    public string HoraFin { get; set; } = string.Empty;
    public int? CupoMaximo { get; set; }
    public int AlumnosInscritos { get; set; }
    public string TipoClase { get; set; } = string.Empty;
    public bool Activo { get; set; }
    public string Slug { get; set; } = string.Empty;
}
