using System.Threading.Tasks;

namespace PromomashTask.Services.Model
{
    public interface IUserStorage
    {
        Task<bool> AddUserAsync(string email, string passwordHash, string address);
        Task<bool> IsUsernameFreeAsync(string email);
    }
}