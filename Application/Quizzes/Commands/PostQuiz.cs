using Domain;
using MediatR;
using Persistence;

namespace Application.Quizzes.Commands;

public class PostQuiz
{
    public class Command : IRequest<string>
    {
        public required PostQuizDto PostQuizDto { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {   
            var category = await context.Categories.FindAsync([request.PostQuizDto.CategoryId], cancellationToken)
                ?? throw new Exception("That categoty doesn't exist.");

            var quiz = new Quiz()
            {
                Title = request.PostQuizDto.Title,
                Description = request.PostQuizDto.Description,
                CategoryId = request.PostQuizDto.CategoryId,
                Category = category
            };

            context.Quizzes.Add(quiz);

            await context.SaveChangesAsync(cancellationToken);

            return quiz.Id;
        }
    }
}
