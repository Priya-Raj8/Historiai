import React, { useState } from 'react';

const QuizSection = ({ questions, title }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Handle invalid questions data
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Handle potentially malformed question data
  if (!currentQuestion || !currentQuestion.options || !Array.isArray(currentQuestion.options)) {
    return null;
  }

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswerChecked(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (!showQuiz) {
    return (
      <div className="my-8 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Test Your Knowledge</h3>
        <p className="text-gray-300 mb-6">
          Ready to see how much you've learned about {title || 'this topic'}? Take this quick quiz to test your understanding!
        </p>
        <button
          className="bg-accent-primary hover:bg-accent-primary/90 text-white py-2 px-6 rounded-full transition-all duration-300"
          onClick={() => setShowQuiz(true)}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="my-8 bg-[#1E1E1E] rounded-lg overflow-hidden">
      <div className="bg-[#2A2A2A] p-4">
        <h3 className="text-xl font-bold text-white">Knowledge Quiz</h3>
        {!quizCompleted && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-accent-primary">
              Score: {score}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {quizCompleted ? (
          <div className="text-center">
            <div className="text-5xl font-bold mb-4">
              {score === questions.length ? (
                <span className="text-green-500">🎉</span>
              ) : score >= questions.length / 2 ? (
                <span className="text-yellow-500">👍</span>
              ) : (
                <span className="text-red-500">🤔</span>
              )}
            </div>
            
            <h4 className="text-2xl font-bold text-white mb-2">
              Quiz Complete!
            </h4>
            
            <p className="text-xl text-gray-300 mb-6">
              You scored {score} out of {questions.length}
              {score === questions.length ? 
                ' - Perfect!' : 
                score >= questions.length / 2 ? 
                  ' - Good job!' : 
                  ' - Keep learning!'}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="bg-accent-primary hover:bg-accent-primary/90 text-white py-2 px-6 rounded-full transition-all duration-300"
                onClick={restartQuiz}
              >
                Try Again
              </button>
              
              <button
                className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white py-2 px-6 rounded-full transition-all duration-300"
                onClick={() => setShowQuiz(false)}
              >
                Close Quiz
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-4">
                {currentQuestion.question || `Question ${currentQuestionIndex + 1}`}
              </h4>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedAnswer === index
                        ? isAnswerChecked
                          ? index === currentQuestion.correctAnswer
                            ? 'bg-green-500/20 border border-green-500'
                            : 'bg-red-500/20 border border-red-500'
                          : 'bg-accent-primary/20 border border-accent-primary'
                        : 'bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-transparent'
                    }`}
                    onClick={() => !isAnswerChecked && setSelectedAnswer(index)}
                    disabled={isAnswerChecked}
                  >
                    <div className="flex items-start">
                      <span className="w-6 h-6 rounded-full bg-[#3A3A3A] flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-300">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              {!isAnswerChecked ? (
                <button
                  className={`bg-accent-primary hover:bg-accent-primary/90 text-white py-2 px-6 rounded-full transition-all duration-300 ${
                    selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={checkAnswer}
                  disabled={selectedAnswer === null}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  className="bg-accent-primary hover:bg-accent-primary/90 text-white py-2 px-6 rounded-full transition-all duration-300"
                  onClick={nextQuestion}
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              )}
              
              <button
                className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white py-2 px-6 rounded-full transition-all duration-300"
                onClick={() => setShowQuiz(false)}
              >
                Exit Quiz
              </button>
            </div>
            
            {isAnswerChecked && (
              <div className={`mt-6 p-4 rounded-lg ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <h5 className={`font-semibold ${
                  selectedAnswer === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
                </h5>
                <p className="text-gray-300 mt-2">
                  {currentQuestion.explanation || `The correct answer is ${String.fromCharCode(65 + currentQuestion.correctAnswer)}: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
