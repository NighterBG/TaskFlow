using MediatR;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Entities;
using TaskStatus = TaskFlow.Domain.Entities.TaskStatus;

namespace TaskFlow.Application.Tasks.Commands.CreateTask;

public record CreateTaskCommand : IRequest<int>
{
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime? DueDate { get; init; }
    public TaskPriority Priority { get; init; }
    public string Color { get; init; } = "white";
    public string UserId { get; init; } = string.Empty;
}

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateTaskCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        var entity = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            DueDate = request.DueDate,
            Priority = request.Priority,
            Color = request.Color,
            Status = TaskStatus.Todo,
            Order = 0, // Will be handled by logic or set to 0 and sorted by ID if same? Better: set in handler.
            UserId = request.UserId
        };

        _context.TaskItems.Add(entity);

        if (request.Color != "white" && request.Color != "#ffffff")
        {
            var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken);
            if (user != null)
            {
                user.ColorChangeCount++;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
