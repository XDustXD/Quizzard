using System.Security.Claims;
using Application.Dto.Results;
using Application.Features.Results.Commands;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ResultsController : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<ResultDto>> SubmitQuiz(SubmitQuizDto submitDto)
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var result = await Mediator.Send(new SubmitQuiz.Command
        {
            QuizId = submitDto.QuizId,
            UserId = userId,
            DurationSeconds = submitDto.DurationSeconds,
            SelectedAnswers = submitDto.SelectedAnswers
        });

        return Ok(result);
    }

    [HttpGet("top")]
    public async Task<ActionResult<List<LeaderboardDto>>> GetTopPerformers()
    {
        return await Mediator.Send(new GetTopPerformers.Query());
    }
}


