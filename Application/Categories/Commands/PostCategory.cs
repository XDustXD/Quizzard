using System;
using Domain;
using MediatR;
using Persistence;

namespace Application.Categories.Commands;

public class PostCategory
{
    public class Command : IRequest<string>
    {
        public required Category Category { get; set; }
    }
    public class Handler(AppDbContext context) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
            context.Categories.Add(request.Category);

            await context.SaveChangesAsync(cancellationToken);

            return request.Category.Id;
        }
    }
}
