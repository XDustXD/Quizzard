using Application.Dto.Categories;
using MediatR;
using Persistence;

namespace Application.Features.Categories.Commands;

public class PutCategory
{
    public class Command : IRequest
    {
        public required PutCategoryDto CategoryDto { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await context.Categories.FindAsync([request.CategoryDto.Id], cancellationToken)
                ?? throw new Exception("Category not found");

            category.Name = request.CategoryDto.Name;

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
