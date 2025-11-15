namespace Domain;

public class Role
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Name { get; set; }
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
