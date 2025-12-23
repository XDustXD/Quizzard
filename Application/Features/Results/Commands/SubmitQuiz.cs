using Application.Dto.Results;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Results.Commands;

public class SubmitQuiz
{
    public class Command : IRequest<ResultDto>
    {
        public required string QuizId { get; set; }
        public int DurationSeconds { get; set; }
        public string? UserId { get; set; } 
        public Dictionary<string, List<string>> SelectedAnswers { get; set; } = [];
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, ResultDto>
    {
        public async Task<ResultDto> Handle(Command request, CancellationToken cancellationToken)
        {
            var quiz = await context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == request.QuizId, cancellationToken)
                ?? throw new Exception("Quiz not found");

            int correctCount = 0;
            int totalQuestions = quiz.Questions.Count;

            foreach (var question in quiz.Questions)
            {
                if (request.SelectedAnswers.TryGetValue(question.Id, out List<string>? selectedAnswerIds))
                {
                    var correctAnswers = question.Answers.Where(a => a.IsCorrect);

                    if (correctAnswers.Count() == selectedAnswerIds.Count)
                    {
                        bool increment = false;

                        foreach (var correct in correctAnswers)
                        {
                            increment = selectedAnswerIds.Contains(correct.Id);

                            if (!increment)
                                break;

                        }

                        if (increment) correctCount++;
                    }
                }
            }

            float score = totalQuestions > 0
                ? ((float)correctCount / totalQuestions) * 100
                : 0;


            var result = new Result
            {
                QuizId = quiz.Id,
                UserId = request.UserId!,
                CorrectCount = correctCount,
                TotalCount = totalQuestions,
                ScorePoint = score,
                DurationSeconds = request.DurationSeconds,
            };

            var user = await context.Users.FindAsync([request.UserId], cancellationToken);
            if (user != null)
            {
                context.Results.Add(result);
                await context.SaveChangesAsync(cancellationToken);
            }

            return new ResultDto
            {
                Id = result.Id,
                CorrectCount = result.CorrectCount,
                TotalCount = totalQuestions,
                ScorePoint = result.ScorePoint,
                DurationSeconds = result.DurationSeconds
            };
        }
    }
}
