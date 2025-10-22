using Api.Comun.Interfaces;

namespace Api.Entidades
{
    public class Usuario : ISlug
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string ApellidoPaterno { get; set; } = string.Empty;
        public string ApellidoMaterno { get; set; } = string.Empty;
        public string NombreUsuario { get; set; } = string.Empty;
        public string Contraseña { get; set; } = string.Empty;
        public string Rol { get; set; } = "Recepcionista"; // "Administrador" o "Recepcionista"
        public bool Habilitado { get; set; } = true;
        public string Slug { get; set; } = string.Empty;

        public virtual ICollection<Pago> PagosRegistrados { get; set; } = new List<Pago>();
        public virtual ICollection<Asistencia> AsistenciasRegistradas { get; set; } = new List<Asistencia>();

        public string ObtenerDescripcionParaSlug()
        {
            return $"{NombreUsuario}";
        }
    }
}
