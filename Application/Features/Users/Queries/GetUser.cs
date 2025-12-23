using Application.Dto.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Users.Queries;

public class GetUser
{
    public class Query : IRequest<GetUserDto>
    {
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, GetUserDto>
    {
        public async Task<GetUserDto> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken)
                    ?? throw new Exception("Cannot find user");


            var userDto = new GetUserDto()
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                RoleName = user.Role.Name
            };

            return userDto;
        }
    }
}
