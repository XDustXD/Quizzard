using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Quizzes.Queries;

public class GetQuiz
{
    public class Query : IRequest<GetQuizDto>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, GetQuizDto>
    {
        public async Task<GetQuizDto> Handle(Query request, CancellationToken cancellationToken)
        {
            var quiz = await context.Quizzes
                .Include(x => x.Category)
                .FirstAsync(x => x.Id == request.Id, cancellationToken)
                    ?? throw new Exception("Cannot find Quiz");

            var dto = new GetQuizDto()
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Description = quiz.Description,
                CategoryId = quiz.CategoryId,
                CategoryName = quiz.Category.Name
            };

            return dto;
        }
    }
}
