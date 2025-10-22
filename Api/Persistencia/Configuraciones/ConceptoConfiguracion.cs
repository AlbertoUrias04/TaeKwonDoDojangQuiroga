using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class ConceptoConfiguracion : IEntityTypeConfiguration<Concepto>
{
    public void Configure(EntityTypeBuilder<Concepto> builder)
    {
        builder.ToTable("Conceptos");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Nombre)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.TipoConcepto)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(c => c.Precio)
            .HasColumnType("decimal(18,2)");

        builder.Property(c => c.Slug)
            .HasMaxLength(200);

        builder.HasMany(c => c.AlumnoInscripciones)
            .WithOne(ai => ai.Concepto)
            .HasForeignKey(ai => ai.ConceptoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Pagos)
            .WithOne(p => p.Concepto)
            .HasForeignKey(p => p.ConceptoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
