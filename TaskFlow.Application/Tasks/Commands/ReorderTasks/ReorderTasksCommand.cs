using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Common.Interfaces;

namespace TaskFlow.Application.Tasks.Commands.ReorderTasks;

public record ReorderTasksCommand(List<TaskOrderDto> Tasks) : IRequest;

public record TaskOrderDto(int Id, int Order);

public class ReorderTasksCommandHandler : IRequestHandler<ReorderTasksCommand>
{
    private readonly IApplicationDbContext _context;

    public ReorderTasksCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(ReorderTasksCommand request, CancellationToken cancellationToken)
    {
        var ids = request.Tasks.Select(t => t.Id).ToList();
        var entities = await _context.TaskItems
            .Where(t => ids.Contains(t.Id))
            .ToListAsync(cancellationToken);

        foreach (var taskDto in request.Tasks)
        {
            var entity = entities.FirstOrDefault(e => e.Id == taskDto.Id);
            if (entity != null)
            {
                entity.Order = taskDto.Order;
            }
        }

        var userId = entities.FirstOrDefault()?.UserId;
        if (!string.IsNullOrEmpty(userId))
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
            if (user != null)
            {
                user.ReorderedCount++;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
