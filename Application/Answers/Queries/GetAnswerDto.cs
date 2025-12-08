using System;

namespace Application.Answers.Queries;

public class GetAnswerDto
{
    public required string Text { get; set; }
    public bool IsCorrect { get; set; }
    public required string QuestionId { get; set; }
    public required string QuestionText { get; set; }
}
