using AutoMapper;
using Api.Comun.Modelos.Clases;
using Api.Entidades;

namespace Api.Perfiles;

public class ClaseProfile : Profile
{
    public ClaseProfile()
    {
        CreateMap<Clase, BuscarClaseDto>()
            .ForMember(dest => dest.HoraInicio, opt => opt.MapFrom(src => src.HoraInicio.ToString(@"hh\:mm")))
            .ForMember(dest => dest.HoraFin, opt => opt.MapFrom(src => src.HoraFin.ToString(@"hh\:mm")))
            .ForMember(dest => dest.AlumnosInscritos, opt => opt.MapFrom(src => src.Alumnos.Count(a => a.Activo)));

        CreateMap<CrearClaseDto, Clase>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.Activo, opt => opt.Ignore())
            .ForMember(dest => dest.Alumnos, opt => opt.Ignore())
            .ForMember(dest => dest.Asistencias, opt => opt.Ignore());

        CreateMap<ModificarClaseDto, Clase>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Alumnos, opt => opt.Ignore())
            .ForMember(dest => dest.Asistencias, opt => opt.Ignore());
    }
}
