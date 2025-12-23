using MediatR;
using Persistence;
using Persistence.Authentication.Interfaces;

namespace Application.Features.Users.Commands;

public class ChangePassword
{
    public class Command : IRequest<bool>
    {
        public required string UserId { get; set; }
        public required string OldPassword { get; set; }
        public required string NewPassword { get; set; }
    }

    public class Handler(AppDbContext context, IPasswordHasher passwordHasher)
         : IRequestHandler<Command, bool>
    {
        public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await context.Users.FindAsync([request.UserId], cancellationToken);
            if (user == null) return false;

            bool isCorrect = passwordHasher.Verify(request.OldPassword, user.PasswordHash);
            if (!isCorrect) throw new UnauthorizedAccessException("Invalid old password");

            user.PasswordHash = passwordHasher.Hash(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
