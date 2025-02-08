using System.Text.RegularExpressions;
using API.Dtos.System;

namespace API.Helpers.Utilities;

public static partial class FunctionUtility
{
    private static string webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

    /// <summary>
    /// Upload a file to server folder.
    /// </summary>
    /// <param name="file">Uploaded file.</param>
    /// <param name="subfolder">Subfolder. Default: "upload"</param>
    /// <param name="rawFileName">Raw file name. Default: uploaded file name.</param>
    /// <returns>File name.</returns>
    public static async Task<string?> UploadAsync(IFormFile file, string subfolder = "upload", string rawFileName = "")
    {
        if (file == null)
            return null;

        var folderPath = Path.Combine(webRootPath, subfolder);
        var fileName = file.FileName;
        var extension = Path.GetExtension(file.FileName);

        if (string.IsNullOrEmpty(extension))
            return null;

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        if (!string.IsNullOrEmpty(rawFileName))
            fileName = $"{rawFileName}{extension}";

        var filePath = Path.Combine(folderPath, fileName);

        if (File.Exists(filePath))
            File.Delete(filePath);

        try
        {
            using (FileStream fs = File.Create(filePath))
            {
                await file.CopyToAsync(fs);
                await fs.FlushAsync();
            }

            return fileName;
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// Upload a base64 string file to server folder.
    /// </summary>
    /// <param name="file">Uploaded file.</param>
    /// <param name="subfolder">Subfolder. Default: "upload"</param>
    /// <param name="rawFileName">Raw file name. Default: uploaded file name.</param>
    /// <returns>File name.</returns>
    public static async Task<string?> UploadAsync(string file, string subfolder = "upload", string rawFileName = "")
    {
        if (string.IsNullOrEmpty(file))
            return null;

        var folderPath = Path.Combine(webRootPath, subfolder);
        var extension = $".{file.Split(';')[0].Split('/')[1]}";

        if (string.IsNullOrEmpty(extension))
            return null;

        var fileName = $"{Guid.NewGuid()}{extension}";

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        if (!string.IsNullOrEmpty(rawFileName))
            fileName = $"{rawFileName}{extension}";

        var filePath = Path.Combine(folderPath, fileName);

        if (File.Exists(filePath))
            File.Delete(filePath);

        var base64String = file[(file.IndexOf(',') + 1)..];
        var fileData = Convert.FromBase64String(base64String);

        try
        {
            await File.WriteAllBytesAsync(filePath, fileData);
            return fileName;
        }
        catch (System.Exception)
        {
            return null;
        }
    }

    private static readonly string[] VietNamChar =
      [
            "aAeEoOuUiIdDyY",
            "áàạảãâấầậẩẫăắằặẳẵ",
            "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
            "éèẹẻẽêếềệểễ",
            "ÉÈẸẺẼÊẾỀỆỂỄ",
            "óòọỏõôốồộổỗơớờợởỡ",
            "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
            "úùụủũưứừựửữ",
            "ÚÙỤỦŨƯỨỪỰỬỮ",
            "íìịỉĩ",
            "ÍÌỊỈĨ",
            "đ",
            "Đ",
            "ýỳỵỷỹ",
            "ÝỲỴỶỸ"
      ];

    public static string RemoveUnicode(string str)
    {
        //Thay thế và lọc dấu từng char
        for (int i = 1; i < VietNamChar.Length; i++)
        {
            for (int j = 0; j < VietNamChar[i].Length; j++)
                str = str.Replace(VietNamChar[i][j], VietNamChar[0][i - 1]);
        }

        str = MyRegex().Replace(str, " ").ToLower();
        return str;
    }

    public static string GenerateSlug(string text)
    {
        // First, remove Vietnamese accents
        text = RemoveUnicode(text);

        // Remove all non-valid chars
        text = MyRegex1().Replace(text, "");

        // Replace multiple spaces and hyphens with a single hyphen
        text = MyRegex2().Replace(text, "-").Trim('-');

        // Convert multiple hyphens into a single hyphen
        text = MyRegex3().Replace(text, "-").ToLower();

        return text;
    }

    public static string GenerateCodeIdentity(string code)
    {
        return (Convert.ToInt32(code) + 1).ToString().PadLeft(5, '0');
    }

    [GeneratedRegex("[^0-9a-zA-Z]+")]
    private static partial Regex MyRegex();
    [GeneratedRegex(@"[^a-zA-Z0-9\s-]")]
    private static partial Regex MyRegex1();
    [GeneratedRegex(@"\s+")]
    private static partial Regex MyRegex2();
    [GeneratedRegex(@"-+")]
    private static partial Regex MyRegex3();

    public static List<T> UnflatteringForLeftMenu<T>(List<T> nodes) where T : ITreeNode, new()
    {
        var map = new Dictionary<string, T>();
        var roots = new List<T>();

        // First pass: Collect nodes into a map
        foreach (var node in nodes)
        {
            node.Children = []; // Initialize children list
            map[node.Id] = node; // Store node in the map
        }

        // Second pass: Build tree structure
        foreach (var node in nodes)
        {
            if (!string.IsNullOrEmpty(node.ParentId) && node.ParentId != "ROOT")
            {
                if (map.TryGetValue(node.ParentId, out T? parentNode))
                {
                    parentNode.Children.Add(node); // Add node to its parent's children list
                }
            }
            else
            {
                roots.Add(node); // Add node to roots if it has no parent or its parent is "ROOT"
            }
        }

        return roots;
    }

    public static List<T> UnflatteringForTree<T>(List<T> nodes) where T : ITreeNode, new()
    {
        var map = new Dictionary<string, int>();
        var roots = new List<T>();

        for (int i = 0; i < nodes.Count; i++)
        {
            map[nodes[i].Id] = i; // initialize the map
            nodes[i].Children = []; // initialize the children
        }

        foreach (var node in nodes)
        {
            if (!string.IsNullOrEmpty(node.ParentId) && map.TryGetValue(node.ParentId, out int value))
            {
                nodes[value].Children.Add(node);
            }
            else
            {
                roots.Add(node);
            }
        }

        return roots;
    }
}