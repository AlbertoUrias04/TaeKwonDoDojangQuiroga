using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Data;
using System.Reflection;
using Api.Comun.Interfaces;
using Api.Entidades;
using Api.Persistencia.Configuraciones;

namespace Api.Persistencia;

public class AplicacionBdContexto : DbContext, IAplicacionBdContexto
{
    private IDbContextTransaction? _actualTransaccion = null;
    public AplicacionBdContexto(DbContextOptions opciones) : base(opciones)
    {
    }
    // Entidades del sistema de autenticación
    public DbSet<Usuario> Usuarios { get; set; }

    // Entidades de la academia de Taekwondo
    public DbSet<Alumno> Alumnos { get; set; }
    public DbSet<Cinta> Cintas { get; set; }
    public DbSet<Clase> Clases { get; set; }
    public DbSet<Concepto> Conceptos { get; set; }
    public DbSet<AlumnoInscripcion> AlumnoInscripciones { get; set; }
    public DbSet<Pago> Pagos { get; set; }
    public DbSet<Asistencia> Asistencias { get; set; }

    public override async Task<int> SaveChangesAsync(CancellationToken cancelacionToken = default)
    {
        foreach (var entrada in ChangeTracker.Entries<ISlug>())
        {
            if (entrada.State == EntityState.Added || entrada.State == EntityState.Modified)
            {
                var entidad = entrada.Entity;
                if (string.IsNullOrWhiteSpace(entidad.Slug))
                {
                    entidad.Slug = entidad.ObtenerDescripcionParaSlug().ToLower().Replace(" ", "-");
                }
            }
        }

        var resultado = await base.SaveChangesAsync(cancelacionToken);
        return resultado;
    }

    public async Task EmpezarTransaccionAsync()
    {
        if (_actualTransaccion != null)
        {
            return;
        }

        _actualTransaccion = await base.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted)
            .ConfigureAwait(false);
    }

    public async Task MandarTransaccionAsync()
    {
        try
        {
            await SaveChangesAsync().ConfigureAwait(false);

            _actualTransaccion?.Commit();
        }
        catch
        {
            CancelarTransaccion();
            throw;
        }
        finally
        {
            if (_actualTransaccion != null)
            {
                _actualTransaccion.Dispose();
                _actualTransaccion = null;
            }
        }
    }

    public void CancelarTransaccion()
    {
        try
        {
            _actualTransaccion?.Rollback();
        }
        finally
        {
            if (_actualTransaccion != null)
            {
                _actualTransaccion.Dispose();
                _actualTransaccion = null;
            }
        }
    }

    public async Task<int> ExecutarSqlComandoAsync(string comandoSql, CancellationToken cancelacionToken)
    {
        return await base.Database.ExecuteSqlRawAsync(comandoSql, cancelacionToken);
    }

    public async Task<int> ExecutarSqlComandoAsync(string comandoSql, IEnumerable<object> parametros, CancellationToken cancelacionToken)
    {
        return await base.Database.ExecuteSqlRawAsync(comandoSql, parametros, cancelacionToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(modelBuilder);
    }
}
