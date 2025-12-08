using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Quizzes.Queries;

public class GetQuizzes
{
    public class Query : IRequest<List<GetQuizDto>>;

    public class Handler(AppDbContext context) : IRequestHandler<Query, List<GetQuizDto>>
    {
        public async Task<List<GetQuizDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var quizzes = await context.Quizzes
                .Include(x => x.Category)
                .ToListAsync(cancellationToken);

            var quizDtos = quizzes.Select(x => new GetQuizDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                CategoryId = x.CategoryId,
                CategoryName = x.Category.Name 
            }).ToList();

            return quizDtos;
        }
    }
}
