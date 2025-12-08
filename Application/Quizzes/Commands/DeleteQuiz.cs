using System;
using MediatR;
using Persistence;

namespace Application.Quizzes.Commands;

public class DeleteQuiz
{
    public class Command : IRequest
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var quiz = await context.Quizzes.FindAsync([request.Id], cancellationToken)
                ?? throw new Exception("Cannot find quiz");

            context.Quizzes.Remove(quiz);

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
