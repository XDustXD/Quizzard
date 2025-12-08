using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Questions.Queries;

public class GetQuetions
{
    public class Query : IRequest<IEnumerable<GetQuestionDto>>;
    public class Handler(AppDbContext context) : IRequestHandler<Query, IEnumerable<GetQuestionDto>>
    {
        public async Task<IEnumerable<GetQuestionDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var questions = await context.Questions
                .Include(x => x.Quiz)
                .ToListAsync(cancellationToken);

            var questionDtos = questions.Select(x => new GetQuestionDto()
            {
                Text = x.Text,
                IsMultipleChoice = x.IsMultipleChoice,
                QuizId = x.QuizId,
                QuizTitle = x.Quiz.Title
            });

            return questionDtos;
        }
    }
}
