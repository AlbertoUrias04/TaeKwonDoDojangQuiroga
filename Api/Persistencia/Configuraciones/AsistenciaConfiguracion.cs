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

        builder.HasOne(a => a.Alumno)
            .WithMany(al => al.Asistencias)
            .HasForeignKey(a => a.AlumnoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.Clase)
            .WithMany(c => c.Asistencias)
            .HasForeignKey(a => a.ClaseId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.UsuarioRegistro)
            .WithMany(u => u.AsistenciasRegistradas)
            .HasForeignKey(a => a.UsuarioRegistroId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
