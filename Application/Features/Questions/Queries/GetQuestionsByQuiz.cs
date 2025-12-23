using Application.Dto.Answers;
using Application.Dto.Questions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Questions.Queries;

public class GetQuestionsByQuiz
{
    public class Query : IRequest<IEnumerable<GetQuestionDto>>
    {
        public required string QuizId { get; set; }
    }
    public class Handler(AppDbContext context) : IRequestHandler<Query, IEnumerable<GetQuestionDto>>
    {
        public async Task<IEnumerable<GetQuestionDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var questions = await context.Questions
                .Include(x => x.Answers)
                .Where(q => q.QuizId == request.QuizId)
                .ToListAsync(cancellationToken);

            var questionDtos = questions.Select(x => new GetQuestionDto()
            {
                Id = x.Id,
                Text = x.Text,
                IsMultipleChoice = x.IsMultipleChoice,
                Answers = x.Answers.Select(a => new GetAnswersDto()
                {
                    Id = a.Id,
                    Text = a.Text
                })
            });

            return questionDtos;
        }
    }
}
