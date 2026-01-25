using TaskFlow.Domain.Common;

namespace TaskFlow.Domain.Entities;

public enum TaskPriority
{
    Low,
    Medium,
    High
}

public enum TaskStatus
{
    Todo,
    InProgress,
    Done
}

public class TaskItem : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public TaskStatus Status { get; set; } = TaskStatus.Todo;
    public string Color { get; set; } = "white";
    public int Order { get; set; }
    
    // Time Tracking
    public long TimeSpentSeconds { get; set; } = 0;
    public DateTime? TrackingStartedAt { get; set; }

    public bool IsArchived { get; set; } = false;
    public DateTime? ArchivedAt { get; set; }

    // Foreign key for User
    public string UserId { get; set; } = string.Empty;
}
