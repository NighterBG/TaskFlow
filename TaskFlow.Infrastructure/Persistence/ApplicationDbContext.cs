using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<AppUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> TaskItems { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserAchievement> UserAchievements { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.Entity<TaskItem>()
            .HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .IsRequired();

        // Seed Achievements
        builder.Entity<Achievement>().HasData(
            new Achievement { Id = 1, Name = "Seed Sower", Description = "Created your first task.", IconKey = "Plus" },
            new Achievement { Id = 2, Name = "Organized", Description = "Reordered your tasks for the first time.", IconKey = "GripVertical" },
            new Achievement { Id = 3, Name = "Done & Dusted", Description = "Completed 5 tasks.", IconKey = "CheckCircle" },
            new Achievement { Id = 4, Name = "Time Traveler", Description = "Tracked 1 hour of productivity.", IconKey = "Clock" },
            new Achievement { Id = 5, Name = "Boutique Artist", Description = "Changed task colors 3 times.", IconKey = "Palette" },
            new Achievement { Id = 6, Name = "Librarian", Description = "Archived 10 tasks to tidy your space.", IconKey = "Book" }
        );
    }
}
