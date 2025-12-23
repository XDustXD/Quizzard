namespace Application.Dto.Results;

public class ResultDto
{
    public required string Id { get; set; }
    public int CorrectCount { get; set; }
    public int TotalCount { get; set; }
    public float ScorePoint { get; set; }
    public int DurationSeconds { get; set; }
}
