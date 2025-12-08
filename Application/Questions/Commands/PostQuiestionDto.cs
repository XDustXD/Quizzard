namespace Application.Questions.Commands;

public class PostQuiestionDto
{
    public required string Text { get; set; }
    public bool IsMultipleChoice {get; set; }
    public required string QuizId { get; set; }
}
