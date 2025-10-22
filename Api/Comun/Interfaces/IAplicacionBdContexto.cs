using Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace Api.Comun.Interfaces;

public interface IAplicacionBdContexto
{
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Alumno> Alumnos { get; set; }
    public DbSet<Cinta> Cintas { get; set; }
    public DbSet<Clase> Clases { get; set; }
    public DbSet<Concepto> Conceptos { get; set; }
    public DbSet<AlumnoInscripcion> AlumnoInscripciones { get; set; }
    public DbSet<Pago> Pagos { get; set; }
    public DbSet<Asistencia> Asistencias { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancelacionToken = default);
    int SaveChanges();
    Task<int> ExecutarSqlComandoAsync(string comandoSql, CancellationToken cancelacionToken);
    Task<int> ExecutarSqlComandoAsync(string comandoSql, IEnumerable<object> parametros, CancellationToken cancelacionToken);
    Task EmpezarTransaccionAsync();
    Task MandarTransaccionAsync();
    void CancelarTransaccion();

}
