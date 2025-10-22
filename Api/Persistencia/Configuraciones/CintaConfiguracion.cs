using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class CintaConfiguracion : IEntityTypeConfiguration<Cinta>
{
    public void Configure(EntityTypeBuilder<Cinta> builder)
    {
        builder.ToTable("Cintas");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Nombre)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.ColorHex)
            .IsRequired()
            .HasMaxLength(7);

        builder.Property(c => c.Slug)
            .HasMaxLength(200);

        builder.HasMany(c => c.Alumnos)
            .WithOne(a => a.CintaActual)
            .HasForeignKey(a => a.CintaActualId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
