namespace Application.Dto.Results;

public class LeaderboardDto
{
    public required string UserName { get; set; }
    public double AverageScore { get; set; }
    public int QuizzesTaken { get; set; }
}
