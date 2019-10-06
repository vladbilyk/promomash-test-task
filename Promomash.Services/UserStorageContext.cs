using Microsoft.EntityFrameworkCore;
using PromomashTask.Services.Model;

namespace PromomashTask.Services
{
    public class UserStorageContext : DbContext
    {
        public UserStorageContext()
        { }

        public UserStorageContext(DbContextOptions<UserStorageContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<User>().HasKey(u => u.Email);

            modelBuilder.Entity<User>().Property(u => u.Email).IsRequired().ValueGeneratedNever();
            modelBuilder.Entity<User>().Property(u => u.Address).IsRequired();
            modelBuilder.Entity<User>().Property(u => u.PasswordHash).IsRequired();
        }
    }
}
