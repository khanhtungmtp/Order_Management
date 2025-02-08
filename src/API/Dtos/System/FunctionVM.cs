namespace API.Dtos.System;

public class FunctionVM
{
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public string ParentId { get; set; } = string.Empty;

    public string Icon { get; set; } = string.Empty;
    public List<string> CommandInFunction { get; set; } = [];
}

public interface ITreeNode
{
    string Id { get; set; }
    string Name { get; set; }
    public string Url { get; set; }

    public int SortOrder { get; set; }

    public string? ParentId { get; set; }

    public string Icon { get; set; }
    List<ITreeNode> Children { get; set; }
}

public class FunctionTreeVM : ITreeNode
{
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public string? ParentId { get; set; } = string.Empty;

    public string Icon { get; set; } = string.Empty;
    public List<ITreeNode> Children { get; set; } = [];
}
