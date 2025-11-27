using Domain;
using MediatR;
using Persistence;

namespace Application.Categories.Commands;

public class PutCategory
{
    public class Command : IRequest
    {
        public required Category Category { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await context.Categories.FindAsync([request.Category.Id], cancellationToken)
                ?? throw new Exception("Category not found");

            category.Name = request.Category.Name;

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
