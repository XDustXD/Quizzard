using System;

namespace Application.Questions.Queries;

public class GetQuestionDto
{
    public required string Text { get; set; }
    public bool IsMultipleChoice { get; set; }
    public required string QuizId { get; set; }
    public required string QuizTitle { get; set; }
}
