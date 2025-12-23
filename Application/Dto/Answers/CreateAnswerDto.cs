namespace Application.Dto.Answers;

public class CreateAnswerDto
{
    public required string Text { get; set; }
    public bool IsCorrect { get; set; }
}