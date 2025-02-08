using FluentValidation;

namespace API.Dtos.Auth.Validator;

public class TokenRequestValidator : AbstractValidator<TokenRequest>
{
    public TokenRequestValidator()
    {
        RuleFor(x => x.Token).NotEmpty().WithMessage("AccessToken value is required");
        RuleFor(x => x.RefreshToken).NotEmpty().WithMessage("RefreshToken value is required");
    }
}