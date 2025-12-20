using Domain;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services;

public class AuthService(AppDbContext context, 
             IPasswordHasher passwordHasher, 
             IJwtProvider jwtProvider) : IAuthService
{

    public async Task RegisterAsync(string dispalayName, string email, string password, string roleName)
    {
        if (await context.Users.AnyAsync(u => u.Email == email))
            throw new Exception("User with this email address already exists");

        var role = await context.Roles.FirstOrDefaultAsync(r => r.Name == roleName)
                   ?? throw new Exception("Role not found");

        var passwordHash = passwordHasher.Hash(password);

        var user = new User
        {
            DisplayName = dispalayName,
            Email = email,
            PasswordHash = passwordHash,
            RoleId = role.Id
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();
    }

    public async Task<string> LoginAsync(string email, string password)
    {
        var user = await context.Users.Include(u => u.Role)
                                      .FirstOrDefaultAsync(u => u.Email == email) 
                                      ?? throw new Exception("Invalid credentials");

        bool isValid = passwordHasher.Verify(password, user.PasswordHash);

        if (!isValid) throw new Exception("Invalid credentials");

        return jwtProvider.Generate(user);
    }
}