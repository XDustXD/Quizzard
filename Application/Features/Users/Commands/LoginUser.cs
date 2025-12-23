using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Persistence.Authentication.Interfaces;

namespace Application.Features.Users.Commands;

public class LoginUser
{
    public class Command : IRequest<string>
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class Handler(AppDbContext context, 
                         IPasswordHasher passwordHasher, 
                         IJwtProvider jwtProvider) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken: cancellationToken)
                ?? throw new Exception("Invalid credentials");

            bool isValid = passwordHasher.Verify(request.Password, user.PasswordHash);

            if (!isValid) throw new Exception("Invalid credentials");

            return jwtProvider.Generate(user);
        }
    }
}
