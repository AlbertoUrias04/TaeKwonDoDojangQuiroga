using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class ClaseConfiguracion : IEntityTypeConfiguration<Clase>
{
    public void Configure(EntityTypeBuilder<Clase> builder)
    {
        builder.ToTable("Clases");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Nombre)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Dias)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.TipoClase)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(c => c.Slug)
            .HasMaxLength(200);

        builder.HasMany(c => c.Alumnos)
            .WithOne(a => a.Clase)
            .HasForeignKey(a => a.ClaseId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(c => c.Asistencias)
            .WithOne(a => a.Clase)
            .HasForeignKey(a => a.ClaseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
