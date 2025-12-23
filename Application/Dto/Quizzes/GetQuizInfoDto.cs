namespace Application.Dto.Quizzes;

public class GetQuizInfoDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public int TimeLimit { get; set; }
    public required string CategoryId { get; set; }
    public required string CategoryName { get; set; }
}
