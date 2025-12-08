namespace Application.Quizzes.Commands;

public class PostQuizDto
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string CategoryId { get; set; }
}
