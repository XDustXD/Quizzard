using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Role> Roles { get; set; }
    public required DbSet<User> Users { get; set; }
    public required DbSet<Quiz> Quizzes { get; set; }
    public required DbSet<Question> Questions { get; set; }
    public required DbSet<Answer> Answers { get; set; }
    public required DbSet<Category> Categories { get; set; }
    public required DbSet<Result> Results { get; set; }
}
