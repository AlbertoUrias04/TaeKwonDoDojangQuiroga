using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class SocioMembresiaConfiguracion : IEntityTypeConfiguration<SocioMembresia>
{
    public void Configure(EntityTypeBuilder<SocioMembresia> builder)
    {
        builder.ToTable("SocioMembresias");
        builder.HasKey(sm => sm.Id);

        builder.Property(sm => sm.Activa)
            .HasColumnName("Activo");

        builder.HasOne(sm => sm.Socio)
            .WithMany(s => s.SocioMembresias)
            .HasForeignKey(sm => sm.SocioId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(sm => sm.Membresia)
            .WithMany(m => m.SocioMembresias)
            .HasForeignKey(sm => sm.MembresiaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
