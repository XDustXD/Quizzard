using Domain;
using MediatR;
using Persistence;

namespace Application.Categories.Queries;

public class GetCategory
{
    public class Query : IRequest<Category>
    {
        public required string Id { get; set; }
    }
    public class Handler(AppDbContext context) : IRequestHandler<Query, Category>
    {
        public async Task<Category> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Categories.FindAsync([request.Id], cancellationToken) 
                ?? throw new Exception("Category not found");
        }
    }
}

