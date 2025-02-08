using System.Text.Json.Serialization;

namespace API.Helpers.Base;

public class ErrorGlobalResponse
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("trackId")]
    [JsonPropertyOrder(-6)]
    public string? TrackId { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("type")]
    [JsonPropertyOrder(-5)]
    public string? Type { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("message")]
    [JsonPropertyOrder(-4)]
    public string? Message { get; set; }

    [JsonPropertyName("statusCode")]
    [JsonPropertyOrder(-3)]
    public int StatusCode { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("detail")]
    [JsonPropertyOrder(-2)]
    public string? Detail { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("instance")]
    [JsonPropertyOrder(-1)]
    public string? Instance { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("errors")]
    [JsonPropertyOrder(-1)]
    public IEnumerable<string>? Errors { get; set; }
}
