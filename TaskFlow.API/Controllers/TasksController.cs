using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.Tasks.Commands.CreateTask;
using TaskFlow.Application.Tasks.Queries.GetTasks;
using TaskFlow.Application.Tasks.Queries.GetArchivedTasks;
using TaskFlow.Application.Tasks.Commands.ArchiveTask;
using TaskFlow.Application.Tasks.Commands.RestoreTask;

using TaskFlow.Application.Common.Interfaces;

namespace TaskFlow.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IAchievementService _achievementService;

    public TasksController(IMediator mediator, IAchievementService achievementService)
    {
        _mediator = mediator;
        _achievementService = achievementService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] string? search)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        if (!string.IsNullOrEmpty(search))
        {
            var searchTasks = await _mediator.Send(new TaskFlow.Application.Tasks.Queries.SearchTasks.SearchTasksQuery(userId, search));
            return Ok(searchTasks);
        }

        var tasks = await _mediator.Send(new GetTasksQuery { UserId = userId });
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(CreateTaskCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // Ensure user can only create tasks for themselves (or handle in Handler)
        // Commands are immutable records, let's just make a new one or assuming client sends userId?
        // Better: client doesn't send UserId, we set it from context.
        // But record properties are init-only.
        // Let's create a new command using 'with' if possible or just use object initializer if records support it.
        // Or cleaner: modify command to NOT include UserId, and have handler read generic CurrentUserService.
        // For now, I'll reconstruct the command.
        
        var newCommand = command with { UserId = userId };
        
        try 
        {
            var id = await _mediator.Send(newCommand);
            var achievements = await _achievementService.CheckAchievementsAsync(userId, default);
            return Ok(new { Id = id, NewAchievements = achievements });
        }
        catch (FluentValidation.ValidationException ex)
        {
            return BadRequest(ex.Errors.Select(e => e.ErrorMessage));
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] TaskFlow.Application.Tasks.Commands.UpdateTaskStatus.UpdateTaskStatusDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await _mediator.Send(new TaskFlow.Application.Tasks.Commands.UpdateTaskStatus.UpdateTaskStatusCommand(id, dto.IsCompleted));
        var achievements = await _achievementService.CheckAchievementsAsync(userId, default);
        return Ok(new { NewAchievements = achievements });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new TaskFlow.Application.Tasks.Commands.DeleteTask.DeleteTaskCommand(id));
        return NoContent();
    }

    [HttpPost("reorder")]
    public async Task<IActionResult> Reorder(TaskFlow.Application.Tasks.Commands.ReorderTasks.ReorderTasksCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await _mediator.Send(command);
        var achievements = await _achievementService.CheckAchievementsAsync(userId, default);
        return Ok(new { NewAchievements = achievements });
    }

    [HttpPost("{id}/toggle-timer")]
    public async Task<IActionResult> ToggleTimer(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var result = await _mediator.Send(new TaskFlow.Application.Tasks.Commands.TimeTracking.ToggleTimerCommand(id));
        var achievements = await _achievementService.CheckAchievementsAsync(userId, default);
        return Ok(new { result.TotalSeconds, result.IsRunning, NewAchievements = achievements });
    }

    [HttpGet("archived")]
    public async Task<IActionResult> GetArchived()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var tasks = await _mediator.Send(new GetArchivedTasksQuery(userId));
        return Ok(tasks);
    }

    [HttpPost("{id}/archive")]
    public async Task<IActionResult> Archive(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await _mediator.Send(new ArchiveTaskCommand(id));
        var achievements = await _achievementService.CheckAchievementsAsync(userId, default);
        return Ok(new { NewAchievements = achievements });
    }

    [HttpPost("{id}/restore")]
    public async Task<IActionResult> Restore(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await _mediator.Send(new RestoreTaskCommand(id));
        var achievements = await _achievementService.CheckAchievementsAsync(userId, default);
        return Ok(new { NewAchievements = achievements });
    }
}
