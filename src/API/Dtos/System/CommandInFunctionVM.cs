namespace API.Dtos.System;

public class CommandInFunctionResponseVM
{
    public required string[] CommandIds { get; set; }

    public required string FunctionId { get; set; }
}
