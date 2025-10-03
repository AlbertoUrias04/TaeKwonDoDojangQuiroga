using Api.Comun.Interfaces;
using Api.Comun.Modelos;
using Api.Persistencia;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Api.Servicios;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var identidadAjustes = builder.Configuration.GetSection("IdentidadAjustes").Get<IdentidadAjuste>();
if (identidadAjustes == null)
{
    throw new Exception("Falta la configuración para IdentidadAjustes.");
}
builder.Services.AddSingleton(identidadAjustes);
builder.Services.AddControllers();
builder.Services.AddDbContext<AplicacionBdContexto>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IAplicacionBdContexto, AplicacionBdContexto>();
builder.Services.AddTransient<IHasherServicio, Sha512HasherServicio>();
builder.Services.AddTransient<ITokenIdentidadServicio, JwtTokenServicio>();
builder.Services.AddScoped<IUsuariosSesionServicio, UsuarioSesionServicio>();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Api", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Inserte el token {Bearer JWT_TOKEN} en el encabezado.",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticasCors", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("Authorization");
    });
});

if (string.IsNullOrEmpty(identidadAjustes.Secreto))
{
    throw new Exception("La clave secreta (Secreto) no puede estar vacía.");
}
builder.Services.AddAuthentication(auth =>
{
    auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    auth.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(opt =>
{
    opt.SaveToken = true;
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(identidadAjustes.Secreto)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        RequireExpirationTime = false,
        ClockSkew = TimeSpan.Zero,
    };
    opt.Events = new JwtBearerEvents
    {
        OnTokenValidated = async (contexto) =>
        {
            var tokenIdentidadServicio = contexto.HttpContext.RequestServices
                .GetRequiredService<ITokenIdentidadServicio>();

            var tokenJwt = contexto.SecurityToken as JwtSecurityToken;
            if (tokenJwt == null)
            {
                contexto.Fail("Token no válido.");
                return;
            }

            var reclamos = tokenIdentidadServicio.ObtenerReclamos(tokenJwt.Claims);

            var tokenValido = await tokenIdentidadServicio.ValidarAsync(reclamos);
            if (tokenValido == false)
            {
                contexto.Fail("Token expirado/invlido.");
            }
        }
    };
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors("PoliticasCors");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();