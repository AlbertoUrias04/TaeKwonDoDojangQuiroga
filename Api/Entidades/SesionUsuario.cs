namespace Api.Entidades;

public class SesionUsuario
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public virtual Usuario? Usuario { get; set; }
    public bool EsPersistente { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime UltimoUso { get; set; }
    public bool Valido { get; set; }
}
