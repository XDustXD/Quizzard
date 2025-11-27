namespace Domain;

public class Answer
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Text { get; set; }
    public bool IsCorrect { get; set; }
    public required string QuestionId {get; set;}
    public required Question Question { get; set; }
}