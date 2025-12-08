using System;
using MediatR;

namespace Application.Roles.Queries;

public class GetRole
{
    public class Query : IRequest<GetRoleDto>;
}
