using System.ComponentModel.DataAnnotations;

namespace PromomashTask.Api.Controllers
{
    public class UserRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Address { get; set; }
    }
}
