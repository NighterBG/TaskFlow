using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Tasks.Queries.SearchTasks;

public record SearchTasksQuery(string UserId, string Term) : IRequest<List<TaskItem>>;

public class SearchTasksQueryHandler : IRequestHandler<SearchTasksQuery, List<TaskItem>>
{
    private readonly IApplicationDbContext _context;

    public SearchTasksQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskItem>> Handle(SearchTasksQuery request, CancellationToken cancellationToken)
    {
        var query = _context.TaskItems.Where(t => t.UserId == request.UserId && !t.IsArchived);

        if (!string.IsNullOrWhiteSpace(request.Term))
        {
            var terms = request.Term.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            foreach (var term in terms)
            {
                query = query.Where(t => t.Title.ToLower().Contains(term) || t.Description.ToLower().Contains(term));
            }
        }

        return await query
            .OrderBy(t => t.Order)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
