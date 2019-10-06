using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PromomashTask.Services;
using System;

namespace PromomashTask.Tests
{
    class TestContext : IDisposable
    {
        SqliteConnection Connection { get; } = new SqliteConnection("DataSource=:memory:");

        internal TestContext()
        {
            Connection.Open();
        }

        internal UserStorageContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<UserStorageContext>()
                .UseSqlite(Connection)
                .Options;

            return new UserStorageContext(options);
        }

        public void Dispose()
        {
            Connection.Dispose();
        }
    }
}
