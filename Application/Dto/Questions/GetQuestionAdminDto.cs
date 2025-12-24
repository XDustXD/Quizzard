using Application.Dto.Answers;

namespace Application.Dto.Questions;

public class GetQuestionAdminDto
{
    public required string Id { get; set; }
    public required string Text { get; set; }
    public bool IsMultipleChoice { get; set; }
    public IEnumerable<GetAnswersAdminDto> Answers { get; set; } = [];
}
