using Application.Dto.Quizzes;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Quizzes.Commands;

public class PutQuiz
{
    public class Command : IRequest
    {
        public required string Id { get; set; }
        public required PostQuizDto PostQuizDto { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var quiz = await context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == request.Id, cancellationToken);

            if (quiz == null) throw new Exception("Quiz not found");

            var category = await context.Categories.FindAsync([request.PostQuizDto.CategoryId], cancellationToken)
                ?? throw new Exception("That category doesn't exist.");

            // Update basic fields
            quiz.Title = request.PostQuizDto.Title;
            quiz.Description = request.PostQuizDto.Description;
            quiz.TimeLimit = request.PostQuizDto.TimeLimit;
            quiz.CategoryId = request.PostQuizDto.CategoryId;
            quiz.Category = category;
            quiz.UpdatedAt = DateTime.UtcNow;

            // Remove existing questions and answers
            context.Questions.RemoveRange(quiz.Questions);

            // Add new questions
            foreach (var qDto in request.PostQuizDto.Questions)
            {
                var question = new Question
                {
                    Text = qDto.Text,
                    IsMultipleChoice = qDto.IsMultipleChoice,
                    Quiz = quiz,
                    QuizId = quiz.Id
                };

                foreach (var aDto in qDto.Answers)
                {
                    var answer = new Answer
                    {
                        Text = aDto.Text,
                        IsCorrect = aDto.IsCorrect,
                        Question = question,
                        QuestionId = question.Id
                    };

                    question.Answers.Add(answer);
                }

                quiz.Questions.Add(question);
            }

            if (quiz.Questions.Any(q => !q.Answers.Any(a => a.IsCorrect)))
                throw new Exception("Every question must have at least one correct answer.");

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
