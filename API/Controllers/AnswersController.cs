using Application.Answers.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AnswersController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetAnswerDto>>> GetAnswers()
    {
        var answers = await Mediator.Send(new GetAnswers.Query());
        return Ok(answers);
    }
}
