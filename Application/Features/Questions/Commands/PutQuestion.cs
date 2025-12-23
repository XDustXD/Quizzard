using Application.Dto.Questions;
using MediatR;
using Persistence;

namespace Application.Features.Questions.Commands;

public class PutQuestion
{
    public class Command : IRequest
    {
        public required PutQuestionDto QuestionDto { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var question = await context.Questions.FindAsync([request.QuestionDto.Id], cancellationToken)
                ?? throw new Exception("Question not found");

            question.Text = request.QuestionDto.Text;
            question.IsMultipleChoice = request.QuestionDto.IsMultipleChoice;

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}

