using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PromomashTask.Model;
using PromomashTask.Services.Model;
using System;
using System.Threading.Tasks;

namespace PromomashTask.Services
{
    class DbUserStorage : IUserStorage
    {
        private UserStorageContext Context { get; }
        private ILogger Logger { get; }

        public DbUserStorage(UserStorageContext context, ILogger<DbUserStorage> logger)
        {
            Context = context;
            Logger = logger;
        }

        public async Task<bool> AddUserAsync(string email, string passwordHash, string address)
        {
            try
            {
                email = email.TrimStart().TrimEnd().ToLower();
                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(passwordHash) || string.IsNullOrWhiteSpace(address))
                {
                    Logger.LogDebug("Invalid parameter was passed");
                    return false;
                }

                Context.Users.Add(new User { Email = email, PasswordHash = passwordHash, Address = address });
                await Context.SaveChangesAsync();
                Logger.LogInformation($"User was added successfully with parameters: {email}, {passwordHash}, {address}.");
                return true;
            }
            catch (Exception e)
            {
                Logger.LogError(e, "User was not added because of exception.");
                return false;
            }
        }

        public async Task<bool> IsUsernameFreeAsync(string email)
        {
            try
            {
                email = email.TrimStart().TrimEnd().ToLower();
                Logger.LogDebug($"Checking user by email {email}");
                var user = await Context.Users.FirstOrDefaultAsync(u => u.Email == email);
                return user == null;
            }
            catch (Exception e)
            {
                Logger.LogError(e, "User was not found because of exception.");
                return true;
            }
        }
    }
}
