using TaskFlow.Domain.Common;

namespace TaskFlow.Domain.Entities;

public class Achievement : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconKey { get; set; } = string.Empty; // Lucide icon name
}
