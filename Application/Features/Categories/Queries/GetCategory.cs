using Application.Dto.Categories;
using MediatR;
using Persistence;

namespace Application.Features.Categories.Queries;

public class GetCategory
{
    public class Query : IRequest<GetCategoryDto>
    {
        public required string Id { get; set; }
    }
    public class Handler(AppDbContext context) : IRequestHandler<Query, GetCategoryDto>
    {
        public async Task<GetCategoryDto> Handle(Query request, CancellationToken cancellationToken)
        {
            var category = await context.Categories.FindAsync([request.Id], cancellationToken)
                ?? throw new Exception("Category not found");

            return new GetCategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
        }
    }
}

