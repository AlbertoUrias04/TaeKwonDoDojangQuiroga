using AutoMapper;
using Api.Comun.Modelos.Pagos;
using Api.Entidades;

namespace Api.Perfiles;

public class PagoProfile : Profile
{
    public PagoProfile()
    {
        CreateMap<Pago, BuscarPagoDto>()
            .ForMember(dest => dest.AlumnoNombre, opt => opt.MapFrom(src => src.Alumno.Nombre + " " + src.Alumno.ApellidoPaterno))
            .ForMember(dest => dest.ConceptoNombre, opt => opt.MapFrom(src => src.Concepto.Nombre))
            .ForMember(dest => dest.TipoConcepto, opt => opt.MapFrom(src => src.Concepto.TipoConcepto))
            .ForMember(dest => dest.UsuarioRegistroNombre, opt => opt.MapFrom(src => src.UsuarioRegistro.Nombre + " " + src.UsuarioRegistro.ApellidoPaterno));

        CreateMap<CrearPagoDto, Pago>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Estado, opt => opt.Ignore())
            .ForMember(dest => dest.UsuarioRegistroId, opt => opt.Ignore())
            .ForMember(dest => dest.Alumno, opt => opt.Ignore())
            .ForMember(dest => dest.Concepto, opt => opt.Ignore())
            .ForMember(dest => dest.UsuarioRegistro, opt => opt.Ignore())
            .ForMember(dest => dest.AlumnoInscripcion, opt => opt.Ignore());

        CreateMap<ModificarPagoDto, Pago>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UsuarioRegistroId, opt => opt.Ignore())
            .ForMember(dest => dest.Alumno, opt => opt.Ignore())
            .ForMember(dest => dest.Concepto, opt => opt.Ignore())
            .ForMember(dest => dest.UsuarioRegistro, opt => opt.Ignore())
            .ForMember(dest => dest.AlumnoInscripcion, opt => opt.Ignore());
    }
}
