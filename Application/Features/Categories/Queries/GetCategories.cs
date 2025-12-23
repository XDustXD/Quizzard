using Application.Dto.Categories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Categories.Queries;

public class GetCategories
{
    public class Query : IRequest<IEnumerable<GetCategoryDto>> { }
    public class Handler(AppDbContext context) : IRequestHandler<Query, IEnumerable<GetCategoryDto>>
    {
        public async Task<IEnumerable<GetCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var categories = await context.Categories.ToListAsync(cancellationToken);

            var categoriesDto = categories.Select(c => new GetCategoryDto
            {
                Id = c.Id,
                Name = c.Name
            });

            return categoriesDto;
        }
    }
}
