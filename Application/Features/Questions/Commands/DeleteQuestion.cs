using MediatR;
using Persistence;

namespace Application.Features.Questions.Commands;

public class DeleteQuestion
{
    public class Command : IRequest
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var question = await context.Questions.FindAsync([request.Id], cancellationToken)
                ?? throw new Exception("Cannot find question");

            context.Questions.Remove(question);

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
