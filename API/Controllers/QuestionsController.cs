using Application.Dto.Questions;
using Application.Features.Questions.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class QuestionsController : BaseApiController
{
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<string>> PostQuestion(PostQuestionDto questionDto)
    {
        return await Mediator.Send(new PostQuestion.Command { QuiestionDto = questionDto });
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> PutQuestion(PutQuestionDto questionDto)
    {
        await Mediator.Send(new PutQuestion.Command { QuestionDto = questionDto });

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteQuestion(string id)
    {
        await Mediator.Send(new DeleteQuestion.Command { Id = id });

        return NoContent();
    }
}
