using Application.Questions.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class QuestionsController : BaseApiController 
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetQuestionDto>>> GetQuestions()
    {
        var questions = await Mediator.Send(new GetQuetions.Query());
        return Ok(questions);
    }
}
