using System;

namespace Application.Quizzes.Queries;

public class GetQuizDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string CategoryId { get; set; }
    public required string CategoryName { get; set; }
}
