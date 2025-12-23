using Application.Dto.Questions;
using Domain;
using MediatR;
using Persistence;

namespace Application.Features.Questions.Commands;

public class PostQuestion
{
    public class Command : IRequest<string>
    {
        public required PostQuestionDto QuiestionDto { get; set; }
    }
    public class Handler(AppDbContext context) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
            var quiz = await context.Quizzes.FindAsync([request.QuiestionDto.QuizId], cancellationToken)
                ?? throw new Exception("Cannot find quiz");

            var quizDto = new Question()
            {
                Text = request.QuiestionDto.Text,
                IsMultipleChoice = request.QuiestionDto.IsMultipleChoice,
                QuizId = request.QuiestionDto.QuizId,
                Quiz = quiz
            };

            context.Questions.Add(quizDto);
            await context.SaveChangesAsync(cancellationToken);

            return quizDto.Id;
        }
    }
}
