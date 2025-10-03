using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class MembresiaConfiguracion : IEntityTypeConfiguration<Membresia>
{
    public void Configure(EntityTypeBuilder<Membresia> builder)
    {
        builder.ToTable("Membresias");
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Nombre)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.Precio)
            .HasColumnType("decimal(18,2)");

        builder.Property(m => m.Slug)
            .HasMaxLength(150);

        builder.Property(m => m.Activa)
            .HasColumnName("Activo");
    }
}
