namespace Domain;

public class Question
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Text { get; set; }
    public bool IsMultipleChoice { get; set; }
    public required Quiz Quiz { get; set; }
    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
}
