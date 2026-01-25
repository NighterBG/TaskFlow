using TaskFlow.Domain.Common;

namespace TaskFlow.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);
    Task<(Result Result, string Token)> LoginAsync(string userName, string password);
    Task<Result> ChangePasswordAsync(string userId, string currentPassword, string newPassword);
}

public class Result
{
    public bool Succeeded { get; set; }
    public string[] Errors { get; set; }

    public static Result Success()
    {
        return new Result { Succeeded = true, Errors = Array.Empty<string>() };
    }

    public static Result Failure(IEnumerable<string> errors)
    {
        return new Result { Succeeded = false, Errors = errors.ToArray() };
    }
}
