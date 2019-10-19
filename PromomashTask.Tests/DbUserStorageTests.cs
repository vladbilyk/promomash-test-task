using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using PromomashTask.Services;
using PromomashTask.Services.Model;
using Xunit;

namespace PromomashTask.Tests
{
    public class DbUserStorageTests
    {
        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("     ")]
        public async Task UserWithemptyEmailShouldNotBeAdded(string email)
        {
            using (var testContext = new TestContext())
            {
                using (var context = testContext.CreateContext())
                {
                    await context.Database.EnsureCreatedAsync();
                    var userStorage = new DbUserStorage(context, new Mock<ILogger<DbUserStorage>>().Object);

                    var result = await userStorage.AddUserAsync(email, "hash", "USA");
                    result.Should().BeFalse();
                }

                using (var context = testContext.CreateContext())
                {
                    context.Users.Should().BeEmpty();
                }
            }
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("     ")]
        public async Task UserWithEmptyHashShouldNotBeAdded(string hash)
        {
            using (var testContext = new TestContext())
            {
                using (var context = testContext.CreateContext())
                {
                    await context.Database.EnsureCreatedAsync();
                    var userStorage = new DbUserStorage(context, new Mock<ILogger<DbUserStorage>>().Object);

                    var result = await userStorage.AddUserAsync("test@test.com", hash, "USA");
                    result.Should().BeFalse();
                }

                using (var context = testContext.CreateContext())
                {
                    context.Users.Should().BeEmpty();
                }
            }
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("     ")]
        public async Task UserWithEmptyAddressShouldNotBeAdded(string address)
        {
            using (var testContext = new TestContext())
            {
                using (var context = testContext.CreateContext())
                {
                    await context.Database.EnsureCreatedAsync();
                    var userStorage = new DbUserStorage(context, new Mock<ILogger<DbUserStorage>>().Object);

                    var result = await userStorage.AddUserAsync("test@test.com", "hash", address);
                    result.Should().BeFalse();
                }

                using (var context = testContext.CreateContext())
                {
                    context.Users.Should().BeEmpty();
                }
            }
        }

        [Theory]
        [InlineData(" test@test.com")]
        [InlineData(" test@test.com   ")]
        [InlineData("Test@Test.com")]
        public async Task UserWithRegisteredEmailShouldNotBeAdded(string email)
        {
            using (var testContext = new TestContext())
            {
                var user = new User {Email = "test@test.com", Address = "UK", PasswordHash = "sdfsdf"};
                using (var context = testContext.CreateContext())
                {
                    await context.Database.EnsureCreatedAsync();
                    context.Users.Add(user);
                    await context.SaveChangesAsync();
                }

                using (var context = testContext.CreateContext())
                {
                    var userStorage = new DbUserStorage(context, new Mock<ILogger<DbUserStorage>>().Object);

                    var result = await userStorage.AddUserAsync(email, "hash", "USA");
                    result.Should().BeFalse();
                }

                using (var context = testContext.CreateContext())
                {
                    context.Users.Should().BeEquivalentTo(user);
                }
            }
        }

        [Theory]
        [InlineData("test@test.com")]
        [InlineData(" test@test.com   ")]
        [InlineData("Test@Test.com")]
        public async Task RegisteredEmailShouldBeFoundInAnyCase(string email)
        {
            using (var testContext = new TestContext())
            {
                using (var context = testContext.CreateContext())
                {
                    await context.Database.EnsureCreatedAsync();
                    context.Users.Add(new User {Email = "test@test.com", Address = "USA", PasswordHash = "hash"});
                    await context.SaveChangesAsync();
                }

                using (var context = testContext.CreateContext())
                {
                    var userStorage = new DbUserStorage(context, new Mock<ILogger<DbUserStorage>>().Object);
                    var result = await userStorage.IsUsernameFreeAsync(email);
                    result.Should().BeFalse();
                }
            }
        }


        [Fact]
        public async Task UserWithValidParametersShouldBeAdded()
        {
            using (var testContext = new TestContext())
            {
                using (var context = testContext.CreateContext())
                {
                    await context.Database.EnsureCreatedAsync();
                    var userStorage = new DbUserStorage(context, new Mock<ILogger<DbUserStorage>>().Object);

                    var result = await userStorage.AddUserAsync("test@test.com", "hash", "USA");
                    result.Should().BeTrue();
                }

                using (var context = testContext.CreateContext())
                {
                    context.Users.Should().BeEquivalentTo(new User
                        {Email = "test@test.com", Address = "USA", PasswordHash = "hash"});
                }
            }
        }
    }
}