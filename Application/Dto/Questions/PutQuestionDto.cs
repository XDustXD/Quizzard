namespace Application.Dto.Questions;

public class PutQuestionDto
{
    public required string Id { get; set; }
    public required string Text { get; set; }
    public bool IsMultipleChoice { get; set; }
}
