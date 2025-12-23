namespace Application.Dto.Results;

public class ResultHistoryDto
{
    public required string QuizTitle { get; set; }
    public float Score { get; set; }
    public int CorrectCount { get; set; }
    public int TotalCount { get; set; }
    public int DurationSeconds { get; set; }
    public DateTime DateTaken { get; set; }
}
