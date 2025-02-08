using FluentValidation;

namespace API.Dtos.UserManager.Validator;

public class RoleVmValidator : AbstractValidator<RoleCreateRequest>
{
    public RoleVmValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Id value is required").MaximumLength(50).WithMessage("Role id cannot over limit 50 characters");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name value is required").MinimumLength(3).WithMessage("Name cannot be less than 3 characters").MaximumLength(50).WithMessage("Name cannot over limit 50 characters");
    }
}
