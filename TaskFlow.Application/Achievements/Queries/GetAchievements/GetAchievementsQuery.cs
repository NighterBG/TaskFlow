using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Achievements.Queries.GetAchievements;

public record GetAchievementsQuery(string UserId) : IRequest<List<AchievementDto>>;

public record AchievementDto(
    int Id,
    string Name,
    string Description,
    string IconKey,
    bool IsEarned,
    DateTime? EarnedAt
);

public class GetAchievementsQueryHandler : IRequestHandler<GetAchievementsQuery, List<AchievementDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAchievementsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AchievementDto>> Handle(GetAchievementsQuery request, CancellationToken cancellationToken)
    {
        var allAchievements = await _context.Achievements.ToListAsync(cancellationToken);
        var earnedAchievements = await _context.UserAchievements
            .Where(ua => ua.UserId == request.UserId)
            .ToListAsync(cancellationToken);

        return allAchievements.Select(a => {
            var earned = earnedAchievements.FirstOrDefault(ea => ea.AchievementId == a.Id);
            return new AchievementDto(
                a.Id,
                a.Name,
                a.Description,
                a.IconKey,
                earned != null,
                earned?.EarnedAt
            );
        }).OrderByDescending(a => a.IsEarned).ThenBy(a => a.Id).ToList();
    }
}
