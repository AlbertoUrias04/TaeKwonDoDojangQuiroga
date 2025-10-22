using AutoMapper;
using Api.Comun.Modelos.Usuarios;
using Api.Entidades;

namespace Api.Perfiles;

public class UsuarioProfile : Profile
{
    public UsuarioProfile()
    {
        CreateMap<Usuario, BuscarUsuariosDto>();

        CreateMap<CrearUsuarioDto, Usuario>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.Contraseña, opt => opt.Ignore());

        CreateMap<ModificarUsuarioDto, Usuario>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.Contraseña, opt => opt.Ignore());
    }
}
