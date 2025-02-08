//  Created Date: 2024-04-08 11:00:54
using System.Text.Json.Serialization;

namespace API.Helpers.Base
{
    public class ApiResponseBase<T>
    {
        // Summary:
        // follows errors.
        // Value: Guiid
        [JsonPropertyName("trackId")]
        public string TrackId { get; } = Guid.NewGuid().ToString();

        // Summary:
        // the HTTP status code.
        // Value:
        // number   
        [JsonPropertyName("statusCode")]
        public int StatusCode { get; }

        // Summary:
        // flag successful.
        // Value:
        // true | false
        [JsonPropertyName("succeeded")]
        public bool Succeeded { get; }

        // Summary:
        // the message success or error response.
        // Remarks:
        // optional
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("message")]
        public string? Message { get; }

        // Summary:
        // the data response.
        // Remarks:
        // optional
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("data")]
        public T? Data { get; }

        protected ApiResponseBase(int statusCode, bool succeeded, string? message = null, T? data = default)
        {
            StatusCode = statusCode;
            Succeeded = succeeded;
            Message = message;
            Data = data;
        }

    }

    public class ApiResponseBase : ApiResponseBase<object>
    {
        protected ApiResponseBase(int statusCode, bool succeeded, string? message = null) : base(statusCode, succeeded, message, null)
        {
        }

    }
}