using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class PagoConfiguracion : IEntityTypeConfiguration<Pago>
{
    public void Configure(EntityTypeBuilder<Pago> builder)
    {
        builder.ToTable("Pagos");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Monto)
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.MetodoPago)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Estado)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasOne(p => p.Socio)
            .WithMany(s => s.Pagos)
            .HasForeignKey(p => p.SocioId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.SocioMembresia)
            .WithMany(sm => sm.Pagos)
            .HasForeignKey(p => p.SocioMembresiaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Sucursal)
            .WithMany()
            .HasForeignKey(p => p.SucursalId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.UsuarioRegistro)
            .WithMany()
            .HasForeignKey(p => p.UsuarioRegistroId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
