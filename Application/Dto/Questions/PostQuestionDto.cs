namespace Application.Dto.Questions;

public class PostQuestionDto
{
    public required string Text { get; set; }
    public bool IsMultipleChoice { get; set; }
    public required string QuizId { get; set; }
}
