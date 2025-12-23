using Application.Dto.Quizzes;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Quizzes.Queries;

public class GetQuizzesInfo
{
    public class Query : IRequest<IEnumerable<GetQuizInfoDto>>;

    public class Handler(AppDbContext context) : IRequestHandler<Query, IEnumerable<GetQuizInfoDto>>
    {
        public async Task<IEnumerable<GetQuizInfoDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var quizzes = await context.Quizzes
                .Include(x => x.Category)
                .ToListAsync(cancellationToken);

            var quizDtos = quizzes.Select(x => new GetQuizInfoDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                TimeLimit = x.TimeLimit,
                CategoryId = x.CategoryId,
                CategoryName = x.Category.Name
            });

            return quizDtos;
        }
    }
}
