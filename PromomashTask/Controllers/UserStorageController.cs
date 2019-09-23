using PromomashTask.Model;
using PromomashTask.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace PromomashTask.Controllers
{
    public class UserStorageController : Controller
    {
        public UserStorageController(IPasswordHasher<User> hasher, IUserStorage storage)
        {
            Hasher = hasher;
            Storage = storage;
        }

        private IPasswordHasher<User> Hasher { get; }
        private IUserStorage Storage { get; }

        [HttpPost("api/users")]
        public async Task<IActionResult> CreateUserAsync([FromBody] UserRequest request)
        {
            if (ModelState.IsValid)
            {
                var hash = Hasher.HashPassword(null, request.Password);

                var result = await Storage.AddUserAsync(request.Email.ToLower(), hash, request.Address);

                return Ok(result);
            }

            // TODO: switch to filter attribute validation
            return BadRequest(ModelState);
        }

        [HttpGet("api/isUsernameFree/{email}")]
        public async Task<IActionResult> IsUsernameFreeAsync(string email)
        {
            var result = await Storage.IsUsernameFreeAsync(email.ToLower());

            return Ok(result);
        }
    }

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
