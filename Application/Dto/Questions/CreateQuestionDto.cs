using Application.Dto.Answers;

namespace Application.Dto.Questions;

public class PostQuestionWithAnswersDto
{
    public required string Text { get; set; }
    public bool IsMultipleChoice { get; set; }

    public List<CreateAnswerDto> Answers { get; set; } = [];
}