using Application.Dto.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Users.Queries;

public class GetUserHistory
{
    public class Query : IRequest<List<ResultHistoryDto>>
    {
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, List<ResultHistoryDto>>
    {
        public async Task<List<ResultHistoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Results
                .Where(r => r.UserId == request.UserId)
                .Include(r => r.Quiz)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ResultHistoryDto
                {
                    QuizTitle = r.Quiz.Title,
                    Score = r.ScorePoint,
                    TotalCount = r.TotalCount,
                    CorrectCount = r.CorrectCount,
                    DurationSeconds = r.DurationSeconds,
                    DateTaken = r.CreatedAt
                })
                .ToListAsync(cancellationToken);
        }
    }
}
