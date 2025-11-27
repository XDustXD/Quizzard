namespace Domain;

public class Result
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public int CorrectCount { get; set; }
    public int TotalCount { get; set; }
    public float ScorePoint { get; set; }
    public int DurationSeconds { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public required string UserId { get; set; }
    public required User Users { get; set; }
    public required string QuizId { get; set; }
    public required Quiz Quiz { get; set; }
}
