namespace Application.Dto.Users;

public class GetUserDto
{
    public required string DisplayName { get; set; }
    public required string Email { get; set; }
    public required string RoleName { get; set; }
}
