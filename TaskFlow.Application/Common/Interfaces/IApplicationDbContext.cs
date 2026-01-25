using Microsoft.EntityFrameworkCore;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TaskItem> TaskItems { get; }
    DbSet<Achievement> Achievements { get; }
    DbSet<UserAchievement> UserAchievements { get; }
    DbSet<AppUser> Users { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
