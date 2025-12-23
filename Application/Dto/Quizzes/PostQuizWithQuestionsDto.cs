using Application.Dto.Questions;

namespace Application.Dto.Quizzes;

public class PostQuizDto
{
    public required string Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public int TimeLimit { get; set; }
    public required string CategoryId { get; set; }

    public List<PostQuestionWithAnswersDto> Questions { get; set; } = [];
}
