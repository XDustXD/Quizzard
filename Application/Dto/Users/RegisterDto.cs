using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Users;

public class RegisterDto
{
    [EmailAddress]
    public required string Email { get; set; }
    public required string DisplayName { get; set; }
    public required string Password { get; set; }
}
