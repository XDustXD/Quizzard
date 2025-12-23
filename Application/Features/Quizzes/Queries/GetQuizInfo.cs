using Application.Dto.Quizzes;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Quizzes.Queries;

public class GetQuizInfo
{
    public class Query : IRequest<GetQuizInfoDto>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, GetQuizInfoDto>
    {
        public async Task<GetQuizInfoDto> Handle(Query request, CancellationToken cancellationToken)
        {
            var quiz = await context.Quizzes
                .Include(x => x.Category)
                .FirstAsync(x => x.Id == request.Id, cancellationToken)
                    ?? throw new Exception("Cannot find Quiz");

            var dto = new GetQuizInfoDto()
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Description = quiz.Description,
                TimeLimit = quiz.TimeLimit,
                CategoryId = quiz.CategoryId,
                CategoryName = quiz.Category.Name
            };

            return dto;
        }
    }
}
