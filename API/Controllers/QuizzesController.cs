using Application.Quizzes.Commands;
using Application.Quizzes.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class QuizzesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<GetQuizDto>>> GetQuizzes()
    {
        return await Mediator.Send(new GetQuizzes.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetQuizDto>> GetQuiz(string id)
    {
        return await Mediator.Send(new GetQuiz.Query() { Id = id });
    }

    [HttpPost]
    public async Task<ActionResult<string>> PostQuiz(PostQuizDto quizDto)
    {
        return await Mediator.Send(new PostQuiz.Command() { PostQuizDto = quizDto });
    }

    // [HttpDelete("{id}")]
    // public async Task
    
}
