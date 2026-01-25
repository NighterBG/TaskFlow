using MediatR;
using TaskFlow.Application.Common.Interfaces;

namespace TaskFlow.Application.Auth.Commands;

public record LoginCommand(string Username, string Password) : IRequest<(Result Result, string Token)>;

public class LoginCommandHandler : IRequestHandler<LoginCommand, (Result Result, string Token)>
{
    private readonly IIdentityService _identityService;

    public LoginCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<(Result Result, string Token)> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        return await _identityService.LoginAsync(request.Username, request.Password);
    }
}

public record RegisterCommand(string Username, string Password) : IRequest<(Result Result, string UserId)>;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, (Result Result, string UserId)>
{
    private readonly IIdentityService _identityService;

    public RegisterCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<(Result Result, string UserId)> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        return await _identityService.CreateUserAsync(request.Username, request.Password);
    }
}

public record ChangePasswordCommand(string UserId, string CurrentPassword, string NewPassword) : IRequest<Result>;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Result>
{
    private readonly IIdentityService _identityService;

    public ChangePasswordCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        return await _identityService.ChangePasswordAsync(request.UserId, request.CurrentPassword, request.NewPassword);
    }
}
