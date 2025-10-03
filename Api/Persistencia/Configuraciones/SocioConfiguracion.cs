using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class SocioConfiguracion : IEntityTypeConfiguration<Socio>
{
    public void Configure(EntityTypeBuilder<Socio> builder)
    {
        builder.ToTable("Socios");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Nombre)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.Email)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(s => s.Slug)
            .HasMaxLength(200);

        builder.HasOne(s => s.Sucursal)
            .WithMany(su => su.Socios)
            .HasForeignKey(s => s.SucursalId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
