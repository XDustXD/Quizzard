using Application.Categories.Commands;
using Application.Categories.Queries;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CategoriesController : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<string>> PostCategory(Category category)
    {
        return await Mediator.Send(new PostCategory.Command { Category = category });
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetCategories()
    {
        return await Mediator.Send(new GetCategories.Query());    
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(string id)
    {
        await Mediator.Send(new DeleteCategory.Command { Id = id });

        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(string id)
    {
        return await Mediator.Send(new GetCategory.Query() {Id = id});
    }

    [HttpPut]
    public async Task<ActionResult> PutCategory(Category category)
    {
        await Mediator.Send(new PutCategory.Command { Category = category });

        return NoContent();
    }
}
