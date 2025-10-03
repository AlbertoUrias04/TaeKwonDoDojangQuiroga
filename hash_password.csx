using System;
using System.Security.Cryptography;
using System.Text;

string password = Args.Length > 0 ? Args[0] : "12345";
var hash = SHA512.HashData(Encoding.UTF8.GetBytes(password));

var sb = new StringBuilder();
for (var i = 0; i < hash.Length; i++)
{
    sb.Append(hash[i].ToString(@"x2"));
}

Console.WriteLine($"Password: {password}");
Console.WriteLine($"SHA512 Hash: {sb}");
