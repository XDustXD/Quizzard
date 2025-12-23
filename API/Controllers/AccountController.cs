using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity.Data;
using Application.Dto.Users;
using Application.Features.Users.Commands;
using Application.Features.Users.Queries;
using Application.Dto.Results;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var token = await Mediator.Send(new LoginUser.Command
        {
            Email = request.Email,
            Password = request.Password
        });

        return Ok(new { Token = token });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto request)
    {
        await Mediator.Send(new RegisterUser.Command
        {
            DisplayName = request.DisplayName,
            Email = request.Email,
            Password = request.Password,
            RoleName = "User"
        });

        return Ok("User successfully registered");
    }

    [HttpGet("history")]
    [Authorize]
    public async Task<ActionResult<List<ResultHistoryDto>>> GetMyHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("User ID not found in claims.");
        return await Mediator.Send(new GetUserHistory.Query { UserId = userId });
    }

    [HttpPut("change-password")]
    [Authorize]
    public async Task<ActionResult<bool>> ChangePassword(ChangePasswordDto request)
    {
        var command = new ChangePassword.Command
        {
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!,
            OldPassword = request.OldPassword,
            NewPassword = request.NewPassword
        };

        return await Mediator.Send(command);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<GetUserDto>> GetUserInfo()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("User ID not found in claims.");

        var userInfo = await Mediator.Send(new GetUser.Query { UserId = userId });

        return Ok(userInfo);
    }
}
