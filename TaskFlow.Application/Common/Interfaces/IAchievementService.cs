using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Common.Interfaces;

public interface IAchievementService
{
    Task<List<Achievement>> CheckAchievementsAsync(string userId, CancellationToken cancellationToken);
}
