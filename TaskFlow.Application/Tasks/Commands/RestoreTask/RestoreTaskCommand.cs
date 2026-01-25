using MediatR;
using TaskFlow.Application.Common.Interfaces;

namespace TaskFlow.Application.Tasks.Commands.RestoreTask;

public record RestoreTaskCommand(int Id) : IRequest;

public class RestoreTaskCommandHandler : IRequestHandler<RestoreTaskCommand>
{
    private readonly IApplicationDbContext _context;

    public RestoreTaskCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(RestoreTaskCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.TaskItems.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity != null)
        {
            entity.IsArchived = false;
            entity.ArchivedAt = null;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
