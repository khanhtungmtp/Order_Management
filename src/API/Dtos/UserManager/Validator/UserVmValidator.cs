using FluentValidation;

namespace API.Dtos.UserManager.Validator;

public class UserVmValidator : AbstractValidator<UserCreateRequest>
{
    public UserVmValidator()
    {
        RuleFor(x => x.UserName).NotEmpty().WithMessage("UserName value is required");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Password value is required").MinimumLength(8).WithMessage("Password has to atleast 8 characters")
                .Matches(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
                .WithMessage("Password is not match complexity rules.");
        RuleFor(x => x.FullName).NotEmpty().WithMessage("FullName value is required").MaximumLength(50).WithMessage("FullName cannot over limit 50 characters");
        RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("Phone number is required");
        RuleFor(x => x.Email)
         .NotEmpty()
         .WithMessage("Email value is required")
         .Matches(@"^[\w.-]+@([\w-]+\.)+[\w-]{2,}$")
         .WithMessage("Email format is not match");
    }
}
