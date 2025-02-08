using API._Services.Interfaces.UserManager;
using API.Dtos.System;
using API.Dtos.UserManager;
using API.Filters.Authorization;
using API.Helpers.Base;
using API.Helpers.Constants;
using API.Helpers.Utilities;
using API.Models.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.UserManager;

public class UsersController(UserManager<User> userManager, I_User userService, RoleManager<IdentityRole> rolesManager) : BaseController
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly RoleManager<IdentityRole> _rolesManager = rolesManager;
    private readonly I_User _userService = userService;

    // url: POST : http://localhost:6001/api/user
    [HttpPost]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.CREATE)]
    public async Task<IActionResult> CreateUser(UserCreateRequest request)
    {
        User? user = new()
        {
            Id = Guid.NewGuid().ToString(),
            UserName = request.UserName,
            FullName = request.FullName,
            Email = request.Email,
            IsActive = request.IsActive,
            PhoneNumber = request.PhoneNumber,
            Gender = (SystemConstants.Gender)request.Gender,
            DateOfBirth = request.DateOfBirth
        };
        IdentityResult? result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(OperationResult.BadRequest(result.Errors));

        if (request.Roles is null)
        {
            await _userManager.AddToRoleAsync(user, "Member");
        }
        else
        {
            foreach (string? role in request.Roles)
            {
                await _userManager.AddToRoleAsync(user, role);
            }
        }

        return Ok(OperationResult.Success("Create user successfully"));
    }

    // url: PUT : http:localhost:6001/api/user/{id}
    [HttpPut("{id}")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.UPDATE)]
    public async Task<IActionResult> PutUser(string id, [FromBody] UserPutRequest request)
    {
        User? user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound(OperationResult.NotFound("User not found"));

        user.FullName = request.FullName;
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            // Remove the current password and add the new one.
            string? resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            IdentityResult? passwordResult = await _userManager.ResetPasswordAsync(user, resetToken, request.Password);
            if (!passwordResult.Succeeded)
                return BadRequest(OperationResult.BadRequest(passwordResult.Errors));
        }

        user.Email = request.Email;
        user.Gender = (SystemConstants.Gender)request.Gender;
        user.PhoneNumber = request.PhoneNumber;
        user.DateOfBirth = request.DateOfBirth;
        user.IsActive = request.IsActive;
        user.UpdatedDate = DateTime.Now;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            // Remove the current password and add the new one.
            string? resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            IdentityResult? passwordResult = await _userManager.ResetPasswordAsync(user, resetToken, request.Password);
            if (!passwordResult.Succeeded)
                return BadRequest(OperationResult.BadRequest(passwordResult.Errors));
        }
        IdentityResult? result = await _userManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            // Update roles if specified
            if (request.Roles is not null && request.Roles.Count != 0)
            {
                IList<string>? currentRoles = await _userManager.GetRolesAsync(user);
                IEnumerable<string>? rolesToAdd = request.Roles.Except(currentRoles);
                IEnumerable<string>? rolesToRemove = currentRoles.Except(request.Roles);

                foreach (string role in rolesToRemove)
                {
                    IdentityResult? removeResult = await _userManager.RemoveFromRoleAsync(user, role);
                    if (!removeResult.Succeeded)
                    {
                        return BadRequest(OperationResult.BadRequest(removeResult.Errors));
                    }
                }

                foreach (string role in rolesToAdd)
                {
                    if (!await _rolesManager.RoleExistsAsync(role))
                    {
                        // Optionally create the role if it doesn't exist
                        await _rolesManager.CreateAsync(new IdentityRole()
                        {
                            Id = role,
                            Name = role,
                            NormalizedName = role.ToUpper(),
                        });
                    }

                    IdentityResult? addResult = await _userManager.AddToRoleAsync(user, role);
                    if (!addResult.Succeeded)
                    {
                        return BadRequest(OperationResult.BadRequest(addResult.Errors));
                    }
                }
            }

            return Ok(OperationResult<string>.Success(user.UserName ?? string.Empty, "Update user successfully"));
        }

        return BadRequest(OperationResult.BadRequest(result.Errors));
    }

    // PATCH api/users/{id}/status
    [HttpPatch("{id}/UpdateStatus")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.UPDATE)]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] bool isActive)
    {
        User? user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound(OperationResult.NotFound("User not found"));
        user.IsActive = isActive;
        IdentityResult? result = await _userManager.UpdateAsync(user);
        if (result.Succeeded)
            return Ok(OperationResult<string>.Success(user.UserName ?? string.Empty, "Update user status successfully"));
        return BadRequest(OperationResult.BadRequest(result.Errors));
    }

    // url: GET : http:localhost:6001/api/user
    [HttpGet]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.VIEW)]
    public async Task<IActionResult> GetPaging([FromQuery] PaginationParam pagination, [FromQuery] UserSearchRequest userSearchRequest)
    {
        return Ok(await _userService.GetPaging(pagination, userSearchRequest));
    }

    // url: GET : http:localhost:6001/api/user/{id}
    [HttpGet("{id}")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.VIEW)]
    public async Task<IActionResult> GetById(string id)
    {
        OperationResult<UserVM>? user = await _userService.GetByIdAsync(id);
        return HandleResult(user);
    }

    // url: PUT : http:localhost:6001/api/user/{id}/change-password
    [HttpPut("{userId}/change-password")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.UPDATE)]
    public async Task<IActionResult> ChangePassword(string userId, [FromBody] UserPasswordChangeRequest request)
    {
        User? user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return NotFound(OperationResult.NotFound("User not found"));
        IdentityResult? result = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
        if (result.Succeeded)
            return Ok(OperationResult.Success("Change password successfully"));
        return BadRequest(OperationResult.BadRequest(result.Errors));
    }

    // url: DELETE : http:localhost:6001/api/user/{id}
    [HttpDelete("{id}")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.DELETE)]
    public async Task<IActionResult> DeleteUser(string id)
    {
        User? user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound(OperationResult.NotFound("User not found"));
        if (user.UserName == SystemConstants.UserNameAdmin)
            return BadRequest(OperationResult.BadRequest("You can't delete admin user."));
        if (user.UserName == UserNameLogedIn)
            return BadRequest(OperationResult.BadRequest("You can't delete yourself."));
        IdentityResult? result = await _userManager.DeleteAsync(user);
        if (result.Succeeded)
        {
            var userVM = new UserVM()
            {
                Id = user.Id,
                UserName = user.UserName ?? string.Empty,
                FullName = user.FullName ?? string.Empty,
                DateOfBirth = user.DateOfBirth,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty
            };
            return Ok(OperationResult<UserVM>.Success(userVM, "Get Users Successfully"));
        }
        return BadRequest(OperationResult.BadRequest(result.Errors));
    }

    // url: DELETE : http:localhost:6001/api/users/{ids}
    [HttpDelete("DeleteUsers")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.DELETE)]
    public async Task<IActionResult> DeleteRangeFunction([FromBody] List<string> ids)
    {
        OperationResult? result = await _userService.DeleteRangeAsync(ids, IdLogedIn);
        return HandleResult(result);
    }

    // GetMenuByUserPermission
    [HttpGet("{userId}/menu-tree")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.VIEW)]
    public async Task<IActionResult> GetMenuByUserPermission(string userId)
    {
        OperationResult<List<FunctionTreeVM>>? result = await _userService.GetMenuByUserPermission(userId);
        return HandleResult(result);
    }

    [HttpGet("{userId}/roles")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.VIEW)]
    public async Task<IActionResult> GetUserRoles(string userId)
    {
        User? user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return NotFound(OperationResult.NotFound($"Cannot found user with id: {userId}"));
        IList<string>? roles = await _userManager.GetRolesAsync(user);
        return Ok(OperationResult<IList<string>>.Success(roles, "Get user roles successfully"));
    }

    [HttpPost("{userId}/roles")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.UPDATE)]
    public async Task<IActionResult> PostRolesToUserUser(string userId, [FromBody] RoleAssignRequest request)
    {
        if (request.RoleNames.Length == 0)
            return BadRequest(OperationResult.BadRequest("Role names cannot empty"));
        User? user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return NotFound(OperationResult.NotFound($"Cannot found user with id: {userId}"));
        IdentityResult? result = await _userManager.AddToRolesAsync(user, request.RoleNames);
        if (result.Succeeded)
            return Ok(OperationResult.Success("Add roles to user successfully"));

        return BadRequest(OperationResult.BadRequest(result.Errors));
    }

    [HttpDelete("{userId}/roles")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.VIEW)]
    public async Task<IActionResult> RemoveRolesFromUser(string userId, [FromQuery] RoleAssignRequest request)
    {
        if (request.RoleNames.Length == 0)
            return BadRequest(OperationResult.BadRequest("Role names cannot empty"));
        if (request.RoleNames.Length == 1 && request.RoleNames[0] == SystemConstants.Roles.Admin)
            return BadRequest(OperationResult.BadRequest($"Cannot remove {SystemConstants.Roles.Admin} role"));
        User? user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return NotFound(OperationResult.NotFound($"Cannot found user with id: {userId}"));
        IdentityResult? result = await _userManager.RemoveFromRolesAsync(user, request.RoleNames);
        if (result.Succeeded)
            return Ok(OperationResult.Success("Remove roles from user successfully"));

        return BadRequest(OperationResult.BadRequest(result.Errors));
    }
}