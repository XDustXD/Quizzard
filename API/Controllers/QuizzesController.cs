using Application.Dto.Questions;
using Application.Dto.Quizzes;
using Application.Features.Questions.Queries;
using Application.Features.Quizzes.Commands;
using Application.Features.Quizzes.Queries;
using Application.Quizzes.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class QuizzesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetQuizInfoDto>>> GetQuizzesInfo()
    {
        var quizzes = await Mediator.Send(new GetQuizzesInfo.Query());

        return Ok(quizzes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetQuizInfoDto>> GetQuizInfo(string id)
    {
        return await Mediator.Send(new GetQuizInfo.Query() { Id = id });
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<string>> PostQuiz(PostQuizDto quizDto)
    {
        var id = await Mediator.Send(new PostQuiz.Command() { PostQuizDto = quizDto });

        return Ok(new { Id = id });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> PutQuiz(string id, PostQuizDto quizDto)
    {
        await Mediator.Send(new PutQuiz.Command() { Id = id, PostQuizDto = quizDto });

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteQuiz(string id)
    {
        await Mediator.Send(new DeleteQuiz.Command() { Id = id });

        return NoContent();
    }

    [HttpGet("{quizId}/questions")]
    public async Task<ActionResult<IEnumerable<GetQuestionDto>>> GetQuestionByQuiz(string quizID)
    {
        var questions = await Mediator.Send(new GetQuestionsByQuiz.Query() { QuizId = quizID });

        return Ok(questions);
    }

    [HttpGet("{quizId}/admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<GetQuestionAdminDto>>> GetQuestionByQuizAdmin(string quizID)
    {
        var questions = await Mediator.Send(new GetQuestionsByQuizAdmin.Query() { QuizId = quizID });

        return Ok(questions);
    }

}
