using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Persistence.Authentication.Interfaces;

namespace Application.Features.Users.Commands;

public class RegisterUser
{
    public class Command : IRequest
    {
        public required string Email { get; set; }
        public required string DisplayName { get; set; }
        public required string Password { get; set; }
        public required string RoleName { get; set; }
    }

    public class Handler(AppDbContext context, IPasswordHasher passwordHasher) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            if (await context.Users.AnyAsync(u => u.Email == request.Email,
                cancellationToken: cancellationToken))
                throw new Exception("User with this email address already exists");

            var role = await context.Roles.FirstOrDefaultAsync(r => r.Name == request.RoleName,
                       cancellationToken: cancellationToken)
                       ?? throw new Exception("Role not found");

            var passwordHash = passwordHasher.Hash(request.Password);

            var user = new User
            {
                DisplayName = request.Email.Split('@')[0],
                Email = request.Email,
                PasswordHash = passwordHash,
                RoleId = role.Id
            };

            context.Users.Add(user);
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
