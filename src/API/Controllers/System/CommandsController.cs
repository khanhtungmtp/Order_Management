using API._Repositories;
using API.Dtos.System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.System;

public class CommandsController(IRepositoryAccessor repoStore) : BaseController
{
    private readonly IRepositoryAccessor _repoStore = repoStore;

    [HttpGet]
    public async Task<IActionResult> GetCommands()
    {
        return Ok(await _repoStore.Commands.FindAll(true).Select(x => new CommandVM()
        {
            Id = x.Id,
            Name = x.Name
        }).ToListAsync());
    }
}
