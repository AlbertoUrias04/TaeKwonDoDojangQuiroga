using Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace Api.Comun.Interfaces;

public interface IAplicacionBdContexto
{
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<SesionUsuario> SesionesUsuario { get; set; }
    public DbSet<Sucursal> Sucursales { get; }
    public DbSet<Socio> Socios { get; set; }
    public DbSet<Membresia> Membresias { get; set; }
    public DbSet<SocioMembresia> SocioMembresias { get; set; }
    public DbSet<Pago> Pagos { get; set; }
    public DbSet<Asistencia> Asistencias { get; set; }
    public DbSet<Proveedor> Proveedores { get; }
    public DbSet<Producto> Productos { get; }
    public DbSet<Venta> Ventas { get; }
    public DbSet<Cancelacion> Cancelaciones { get; }
    public DbSet<Reembolso> Reembolsos { get; }

    Task<int> SaveChangesAsync(CancellationToken cancelacionToken = default);
    int SaveChanges();
    Task<int> ExecutarSqlComandoAsync(string comandoSql, CancellationToken cancelacionToken);
    Task<int> ExecutarSqlComandoAsync(string comandoSql, IEnumerable<object> parametros, CancellationToken cancelacionToken);
    Task EmpezarTransaccionAsync();
    Task MandarTransaccionAsync();
    void CancelarTransaccion();

}
