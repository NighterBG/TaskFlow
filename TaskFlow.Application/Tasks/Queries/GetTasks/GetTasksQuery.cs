using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Tasks.Queries.GetTasks;

public record GetTasksQuery : IRequest<List<TaskItem>>
{
    public string UserId { get; init; } = string.Empty;
}

public class GetTasksQueryHandler : IRequestHandler<GetTasksQuery, List<TaskItem>>
{
    private readonly IApplicationDbContext _context;

    public GetTasksQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskItem>> Handle(GetTasksQuery request, CancellationToken cancellationToken)
    {
        return await _context.TaskItems
            .Where(t => t.UserId == request.UserId && !t.IsArchived)
            .OrderBy(t => t.Order)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
