namespace Application.Dto.Answers;

public class GetAnswersAdminDto
{
    public required string Id { get; set; }
    public required string Text { get; set; }
    public bool IsCorrect { get; set; }
}
