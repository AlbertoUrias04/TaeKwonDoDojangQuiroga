using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class AlumnoInscripcionConfiguracion : IEntityTypeConfiguration<AlumnoInscripcion>
{
    public void Configure(EntityTypeBuilder<AlumnoInscripcion> builder)
    {
        builder.ToTable("AlumnoInscripciones");
        builder.HasKey(ai => ai.Id);

        builder.HasOne(ai => ai.Alumno)
            .WithMany(a => a.AlumnoInscripciones)
            .HasForeignKey(ai => ai.AlumnoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ai => ai.Concepto)
            .WithMany(c => c.AlumnoInscripciones)
            .HasForeignKey(ai => ai.ConceptoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(ai => ai.Pagos)
            .WithOne(p => p.AlumnoInscripcion)
            .HasForeignKey(p => p.AlumnoInscripcionId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
