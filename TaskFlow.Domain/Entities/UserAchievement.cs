using TaskFlow.Domain.Common;

namespace TaskFlow.Domain.Entities;

public class UserAchievement : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public int AchievementId { get; set; }
    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

    public Achievement Achievement { get; set; } = null!;
}
