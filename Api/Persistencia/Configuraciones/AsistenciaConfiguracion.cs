using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class AsistenciaConfiguracion : IEntityTypeConfiguration<Asistencia>
{
    public void Configure(EntityTypeBuilder<Asistencia> builder)
    {
        builder.ToTable("Asistencias");
        builder.HasKey(a => a.Id);

        builder.HasOne(a => a.Socio)
            .WithMany(s => s.Asistencias)
            .HasForeignKey(a => a.SocioId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Sucursal)
            .WithMany()
            .HasForeignKey(a => a.SucursalId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
