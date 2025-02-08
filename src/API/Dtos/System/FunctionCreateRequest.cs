namespace API.Dtos.System;

public class FunctionCreateRequest
{
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public string ParentId { get; set; } = string.Empty;

    public string Icon { get; set; } = string.Empty;
}
