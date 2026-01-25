using Microsoft.AspNetCore.Identity;

namespace TaskFlow.Domain.Entities;

public class AppUser : IdentityUser
{
    public string? FullName { get; set; }
    public int ColorChangeCount { get; set; } = 0;
    public int ReorderedCount { get; set; } = 0;
}
