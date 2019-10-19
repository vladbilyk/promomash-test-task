using System;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PromomashTask.Services;

namespace PromomashTask.Tests
{
    internal class TestContext : IDisposable
    {
        internal TestContext()
        {
            Connection.Open();
        }

        private SqliteConnection Connection { get; } = new SqliteConnection("DataSource=:memory:");

        public void Dispose()
        {
            Connection.Dispose();
        }

        internal UserStorageContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<UserStorageContext>()
                .UseSqlite(Connection)
                .Options;

            return new UserStorageContext(options);
        }
    }
}