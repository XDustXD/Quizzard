using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Roles.Queries;

public class GetRoles
{
    public class Query : IRequest<IEnumerable<GetRoleDto>>;

    public class Handler(AppDbContext context) : IRequestHandler<Query, IEnumerable<GetRoleDto>>
    {
        public async Task<IEnumerable<GetRoleDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var roles = await context.Roles.ToListAsync(cancellationToken);

            // var roleDtos = roles.Select(x => new GetRoleDto()
            // {
            //     Id = x.Id,
            //     Name = x.Name
            // });

            return new List<GetRoleDto>();
        }
    }
}
