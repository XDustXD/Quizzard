using System.ComponentModel.DataAnnotations;

namespace Domain;

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [EmailAddress]
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string DisplayName { get; set; }
    public DateTime RegistredAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string RoleId { get; set; }
    public Role Role { get; set; } = null!;
    public virtual ICollection<Result> Results { get; set; } = new List<Result>();
}
