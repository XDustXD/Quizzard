using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Answers.Queries;

public class GetAnswers
{
    public class Query : IRequest<IEnumerable<GetAnswerDto>>;

    public class Handler(AppDbContext context) : IRequestHandler<Query, IEnumerable<GetAnswerDto>>
    {
        public async Task<IEnumerable<GetAnswerDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var answers = await context.Answers
                .Include(x => x.Question)
                .ToListAsync(cancellationToken);

            var answerDtos = answers.Select(x => new GetAnswerDto()
            {
                Text = x.Text,
                IsCorrect = x.IsCorrect,
                QuestionId = x.QuestionId,
                QuestionText = x.Question.Text
            });

            return answerDtos;
        }
    }
}
