using Application.Dto.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Results.Commands;

public class GetTopPerformers
{
    public class Query : IRequest<List<LeaderboardDto>>
    {
        public int Count { get; set; } = 10;
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, List<LeaderboardDto>>
    {

        public async Task<List<LeaderboardDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Results
                .Include(r => r.Users)
                .GroupBy(r => new { r.UserId, r.Users.DisplayName })
                .Select(g => new LeaderboardDto
                {
                    UserName = g.Key.DisplayName,
                    AverageScore = g.Average(r => r.ScorePoint),
                    QuizzesTaken = g.Count()
                })
                .OrderByDescending(x => x.AverageScore)
                .Take(request.Count)
                .ToListAsync(cancellationToken);
        }
    }
}
