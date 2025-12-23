using Application.Dto.Quizzes;
using Domain;
using MediatR;
using Persistence;

namespace Application.Features.Quizzes.Commands;

public class PostQuiz
{
    public class Command : IRequest<string>
    {
        public required PostQuizDto PostQuizDto { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await context.Categories.FindAsync([request.PostQuizDto.CategoryId], cancellationToken)
                ?? throw new Exception("That categoty doesn't exist.");

            var quiz = new Quiz()
            {
                Title = request.PostQuizDto.Title,
                Description = request.PostQuizDto.Description,
                TimeLimit = request.PostQuizDto.TimeLimit,
                CategoryId = request.PostQuizDto.CategoryId,
                Category = category
            };

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

            context.Quizzes.Add(quiz);

            await context.SaveChangesAsync(cancellationToken);

            return quiz.Id;
        }
    }
}
