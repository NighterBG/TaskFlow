using MediatR;
using TaskFlow.Application.Common.Interfaces;

namespace TaskFlow.Application.Tasks.Commands.TimeTracking;

public record ToggleTimerCommand(int Id) : IRequest<(long TotalSeconds, bool IsRunning)>;

public class ToggleTimerCommandHandler : IRequestHandler<ToggleTimerCommand, (long TotalSeconds, bool IsRunning)>
{
    private readonly IApplicationDbContext _context;

    public ToggleTimerCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<(long TotalSeconds, bool IsRunning)> Handle(ToggleTimerCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.TaskItems.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null) return (0, false);

        if (entity.TrackingStartedAt.HasValue)
        {
            // Stopping timer
            var elapsed = (long)(DateTime.UtcNow - entity.TrackingStartedAt.Value).TotalSeconds;
            entity.TimeSpentSeconds += elapsed;
            entity.TrackingStartedAt = null;
        }
        else
        {
            // Starting timer
            entity.TrackingStartedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);
        
        return (entity.TimeSpentSeconds, entity.TrackingStartedAt.HasValue);
    }
}
