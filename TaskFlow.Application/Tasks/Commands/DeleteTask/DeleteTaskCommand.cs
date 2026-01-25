using MediatR;
using TaskFlow.Application.Common.Interfaces;

namespace TaskFlow.Application.Tasks.Commands.DeleteTask;

public record DeleteTaskCommand(int Id) : IRequest;

public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteTaskCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.TaskItems.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null) return;

        _context.TaskItems.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
