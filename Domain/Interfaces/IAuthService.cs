namespace Domain.Interfaces;

public interface IAuthService
{
    Task<string> LoginAsync(string email, string password);
    Task RegisterAsync(string dispalayName, string email, string password, string roleName);
}
