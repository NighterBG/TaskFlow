using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Tasks.Queries.GetArchivedTasks;

public record GetArchivedTasksQuery(string UserId) : IRequest<List<TaskItem>>;

public class GetArchivedTasksQueryHandler : IRequestHandler<GetArchivedTasksQuery, List<TaskItem>>
{
    private readonly IApplicationDbContext _context;

    public GetArchivedTasksQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskItem>> Handle(GetArchivedTasksQuery request, CancellationToken cancellationToken)
    {
        return await _context.TaskItems
            .Where(t => t.UserId == request.UserId && t.IsArchived)
            .OrderByDescending(t => t.ArchivedAt)
            .ToListAsync(cancellationToken);
    }
}
