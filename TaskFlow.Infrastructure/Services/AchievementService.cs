using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Infrastructure.Services;

public class AchievementService : IAchievementService
{
    private readonly IApplicationDbContext _context;

    public AchievementService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Achievement>> CheckAchievementsAsync(string userId, CancellationToken cancellationToken)
    {
        var newAchievements = new List<Achievement>();
        
        // Load already earned achievement IDs
        var earnedIds = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Select(ua => ua.AchievementId)
            .ToListAsync(cancellationToken);

        // Load stats
        var taskCount = await _context.TaskItems.CountAsync(t => t.UserId == userId, cancellationToken);
        var completedCount = await _context.TaskItems.CountAsync(t => t.UserId == userId && t.Status == TaskFlow.Domain.Entities.TaskStatus.Done, cancellationToken);
        var totalTime = await _context.TaskItems.Where(t => t.UserId == userId).SumAsync(t => t.TimeSpentSeconds, cancellationToken);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        var colorChanges = user?.ColorChangeCount ?? 0;
        var reorderedCount = user?.ReorderedCount ?? 0;
        var archivedCount = await _context.TaskItems.CountAsync(t => t.UserId == userId && t.IsArchived, cancellationToken);

        // Logic check
        async Task TryAward(int id, Func<bool> criteria)
        {
            if (!earnedIds.Contains(id) && criteria())
            {
                var achievement = await _context.Achievements.FindAsync(new object[] { id }, cancellationToken);
                if (achievement != null)
                {
                    _context.UserAchievements.Add(new UserAchievement
                    {
                        UserId = userId,
                        AchievementId = id
                    });
                    newAchievements.Add(achievement);
                }
            }
        }

        await TryAward(1, () => taskCount >= 1); // Seed Sower
        await TryAward(2, () => reorderedCount >= 1); // Organized
        await TryAward(3, () => completedCount >= 5); // Done & Dusted
        await TryAward(4, () => totalTime >= 3600); // Time Traveler
        await TryAward(5, () => colorChanges >= 3); // Boutique Artist
        await TryAward(6, () => archivedCount >= 10); // Librarian

        if (newAchievements.Any())
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        return newAchievements;
    }
}
