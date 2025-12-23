using Application.Dto.Categories;
using Application.Features.Categories.Commands;
using Application.Features.Categories.Queries;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CategoriesController : BaseApiController
{
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<string>> PostCategory(Category category)
    {
        var id = await Mediator.Send(new PostCategory.Command { Category = category });

        return Ok(new { Id = id });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetCategoryDto>>> GetCategories()
    {
        var categories = await Mediator.Send(new GetCategories.Query());

        return Ok(categories);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteCategory(string id)
    {
        await Mediator.Send(new DeleteCategory.Command { Id = id });

        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetCategoryDto>> GetCategory(string id)
    {
        return await Mediator.Send(new GetCategory.Query() { Id = id });
    }

    [HttpPut]
    public async Task<ActionResult> PutCategory(PutCategoryDto categoryDto)
    {
        await Mediator.Send(new PutCategory.Command { CategoryDto = categoryDto });

        return NoContent();
    }
}
