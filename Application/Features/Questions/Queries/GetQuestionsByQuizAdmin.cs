using Application.Dto.Answers;
using Application.Dto.Questions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Questions.Queries;

public class GetQuestionsByQuizAdmin
{
    public class Query : IRequest<IEnumerable<GetQuestionAdminDto>>
    {
        public required string QuizId { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, IEnumerable<GetQuestionAdminDto>>
    {
        public async Task<IEnumerable<GetQuestionAdminDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var questions = await context.Questions
                .Include(x => x.Answers)
                .Where(q => q.QuizId == request.QuizId)
                .ToListAsync(cancellationToken);

            var questionDtos = questions.Select(x => new GetQuestionAdminDto()
            {
                Id = x.Id,
                Text = x.Text,
                IsMultipleChoice = x.IsMultipleChoice,
                Answers = x.Answers.Select(a => new GetAnswersAdminDto()
                {
                    Id = a.Id,
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                })
            });

            return questionDtos;
        }
    }
}
