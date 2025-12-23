using MediatR;
using Persistence;

namespace Application.Features.Categories.Commands;

public class DeleteCategory
{
    public class Command : IRequest
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await context.Categories.FindAsync([request.Id], cancellationToken)
                ?? throw new Exception("Cannot find category");

            context.Categories.Remove(category);

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
