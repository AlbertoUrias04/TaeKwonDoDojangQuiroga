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

        // Índices para mejorar performance en consultas frecuentes
        builder.HasIndex(p => p.Fecha)
            .HasDatabaseName("IX_Pagos_Fecha");

        builder.HasIndex(p => p.Estado)
            .HasDatabaseName("IX_Pagos_Estado");

        builder.HasIndex(p => p.AlumnoId)
            .HasDatabaseName("IX_Pagos_AlumnoId");

        builder.HasIndex(p => p.ConceptoId)
            .HasDatabaseName("IX_Pagos_ConceptoId");

        builder.HasIndex(p => new { p.Estado, p.Fecha })
            .HasDatabaseName("IX_Pagos_Estado_Fecha");

        builder.HasIndex(p => new { p.AlumnoId, p.Fecha })
            .HasDatabaseName("IX_Pagos_AlumnoId_Fecha");

        builder.HasOne(p => p.Alumno)
            .WithMany(a => a.Pagos)
            .HasForeignKey(p => p.AlumnoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Concepto)
            .WithMany(c => c.Pagos)
            .HasForeignKey(p => p.ConceptoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.AlumnoInscripcion)
            .WithMany(ai => ai.Pagos)
            .HasForeignKey(p => p.AlumnoInscripcionId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(p => p.UsuarioRegistro)
            .WithMany(u => u.PagosRegistrados)
            .HasForeignKey(p => p.UsuarioRegistroId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
