using Application.Roles.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
    
public class RolesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetRoleDto>>> GetRoles()
    {
        var roles = Mediator.Send(new GetRoles.Query());
        return Ok(roles);
    }
}
