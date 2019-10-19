using System;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PromomashTask.Services.Model;
using Xunit;

namespace PromomashTask.Tests
{
    public class ModelTests
    {
        [Fact]
        public async Task AddingTheSameUserTwiceShouldThrowException()
        {
            using (var testContext = new TestContext())
            {
                var user = new User {Email = "test@sample.com", PasswordHash = "hash", Address = "USA"};

                using (var context = testContext.CreateContext())
                {
                    await context.Database.EnsureCreatedAsync();

                    context.Add(user);
                    await context.SaveChangesAsync();
                }

                using (var context = testContext.CreateContext())
                {
                    context.Add(user);
                    Func<Task> action = async () => await context.SaveChangesAsync();
                    action.Should().Throw<DbUpdateException>();
                }

                using (var context = testContext.CreateContext())
                {
                    context.Users.Should().BeEquivalentTo(user);
                }
            }
        }

        [Fact]
        public async Task AddingUserWithoutAddressShouldThrowException()
        {
            using (var testContext = new TestContext())
            {
                using (var context = testContext.CreateContext())
                {
                    await context.Database.EnsureCreatedAsync();
                }

                using (var context = testContext.CreateContext())
                {
                    context.Add(new User {Email = "test@test.com", PasswordHash = "hash"});
                    Func<Task> action = async () => await context.SaveChangesAsync();
                    action.Should().Throw<DbUpdateException>()
                        .WithInnerException<SqliteException>()
                        .WithMessage("SQLite Error 19: 'NOT NULL constraint failed: Users.Address'.");
                }

                using (var context = testContext.CreateContext())
                {
                    context.Users.Should().BeEmpty();
                }
            }
        }

        [Fact]
        public async Task AddingUserWithoutEmailShouldThrowException()
        {
            using (var testContext = new TestContext())
            {
                using (var context = testContext.CreateContext())
                {
                    await context.Database.EnsureCreatedAsync();
                }

                using (var context = testContext.CreateContext())
                {
                    Action action = () => context.Add(new User {Address = "USA", PasswordHash = "hash"});
                    action.Should().Throw<InvalidOperationException>()
                        .WithMessage(
                            "Unable to track an entity of type 'User' because primary key property 'Email' is null.");
                }

                using (var context = testContext.CreateContext())
                {
                    context.Users.Should().BeEmpty();
                }
            }
        }

        [Fact]
        public async Task AddingUserWithoutHashedPasswordShouldThrowException()
        {
            using (var testContext = new TestContext())
            {
                using (var context = testContext.CreateContext())
                {
                    await context.Database.EnsureCreatedAsync();
                }

                using (var context = testContext.CreateContext())
                {
                    context.Add(new User {Email = "test@test.com", Address = "USA"});
                    Func<Task> action = async () => await context.SaveChangesAsync();
                    action.Should().Throw<DbUpdateException>()
                        .WithInnerException<SqliteException>()
                        .WithMessage("SQLite Error 19: 'NOT NULL constraint failed: Users.PasswordHash'.");
                }

                using (var context = testContext.CreateContext())
                {
                    context.Users.Should().BeEmpty();
                }
            }
        }
    }
}