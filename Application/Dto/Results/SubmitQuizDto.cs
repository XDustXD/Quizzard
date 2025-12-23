namespace Application.Dto.Results;

public class SubmitQuizDto
{
    public required string QuizId { get; set; }
    public int DurationSeconds { get; set; }
    public Dictionary<string, List<string>> SelectedAnswers { get; set; } = [];
}