using MediatR;
using TaskFlow.Application.Common.Interfaces;

namespace TaskFlow.Application.Tasks.Commands.ArchiveTask;

public record ArchiveTaskCommand(int Id) : IRequest;

public class ArchiveTaskCommandHandler : IRequestHandler<ArchiveTaskCommand>
{
    private readonly IApplicationDbContext _context;

    public ArchiveTaskCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(ArchiveTaskCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.TaskItems.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity != null)
        {
            entity.IsArchived = true;
            entity.ArchivedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
