using AutoMapper;
using Api.Comun.Modelos.Conceptos;
using Api.Entidades;

namespace Api.Perfiles;

public class ConceptoProfile : Profile
{
    public ConceptoProfile()
    {
        CreateMap<Concepto, BuscarConceptoDto>();

        CreateMap<CrearConceptoDto, Concepto>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.Activo, opt => opt.Ignore())
            .ForMember(dest => dest.AlumnoInscripciones, opt => opt.Ignore())
            .ForMember(dest => dest.Pagos, opt => opt.Ignore());

        CreateMap<ModificarConceptoDto, Concepto>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.Activo, opt => opt.Ignore())
            .ForMember(dest => dest.AlumnoInscripciones, opt => opt.Ignore())
            .ForMember(dest => dest.Pagos, opt => opt.Ignore());
    }
}
