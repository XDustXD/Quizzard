namespace Domain;

public class Quiz
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string CategoryId { get; set; }
    public required Category Category { get; set; }
    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    public virtual ICollection<Result> Results { get; set; } = new List<Result>();
}
