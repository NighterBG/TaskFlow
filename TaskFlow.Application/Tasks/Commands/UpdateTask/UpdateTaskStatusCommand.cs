using MediatR;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Entities;
using TaskStatus = TaskFlow.Domain.Entities.TaskStatus;

namespace TaskFlow.Application.Tasks.Commands.UpdateTask;

public record UpdateTaskStatusCommand(int Id, bool IsCompleted) : IRequest;

public class UpdateTaskStatusCommandHandler : IRequestHandler<UpdateTaskStatusCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateTaskStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateTaskStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.TaskItems.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            // In a real app we might throw NotFoundException
            return;
        }

        entity.Status = request.IsCompleted ? TaskStatus.Done : TaskStatus.Todo;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
