namespace Domain;

public class Category
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Name { get; set; }
    public virtual ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
}