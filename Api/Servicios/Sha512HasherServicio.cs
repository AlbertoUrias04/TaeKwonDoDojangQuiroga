using System.Security.Cryptography;
using System.Text;
using Api.Comun.Interfaces;

namespace Api.Servicios;

public class Sha512HasherServicio : IHasherServicio
{
    public Sha512HasherServicio()
    {
    }

    public string GenerarHash(string contrasena)
    {
        return _GenerarHashSha512(contrasena);
    }

    private string _GenerarHashSha512(string cadena)
    {
        var hash = SHA512.HashData(Encoding.UTF8.GetBytes(cadena));

        var sb = new StringBuilder();
        for (var i = 0; i < hash.Length; i++)
        {
            sb.Append(hash[i].ToString(@"X2")); // X2 = mayúsculas, x2 = minúsculas
        }

        return sb.ToString();
    }

}