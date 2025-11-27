using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Categories.Queries;

public class GetCategories
{
    public class Query : IRequest<List<Category>>{}
    public class Handler(AppDbContext context) : IRequestHandler<Query, List<Category>>
    {
        public async Task<List<Category>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Categories.ToListAsync(cancellationToken);
        }
    }
}
