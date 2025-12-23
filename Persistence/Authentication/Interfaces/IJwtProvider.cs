using Domain;

namespace Persistence.Authentication.Interfaces;

public interface IJwtProvider
{
    string Generate(User user);
}