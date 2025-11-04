using Api.Comun.Modelos.Asistencias;
using Api.Entidades;
using AutoMapper;

namespace Api.Perfiles;

public class AsistenciaProfile : Profile
{
    public AsistenciaProfile()
    {
        CreateMap<Asistencia, BuscarAsistenciaDto>()
            .ForMember(dest => dest.AlumnoNombre, opt => opt.MapFrom(src =>
                $"{src.Alumno.Nombre} {src.Alumno.ApellidoPaterno} {src.Alumno.ApellidoMaterno}"))
            .ForMember(dest => dest.ClaseNombre, opt => opt.MapFrom(src => src.Clase.Nombre))
            .ForMember(dest => dest.UsuarioRegistroNombre, opt => opt.MapFrom(src =>
                $"{src.UsuarioRegistro.Nombre} {src.UsuarioRegistro.ApellidoPaterno}"));

        CreateMap<RegistrarAsistenciaDto, Asistencia>();
    }
}
