import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaClock, FaCheck, FaTimes, FaLightbulb, FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { getQuizLevel, getQuizCategory } from '@/data/quizData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserProgress, QuizResult } from '@/types/quiz';

const QuizPage = () => {
  const { categoryId, levelId } = useParams<{ categoryId: string; levelId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useLocalStorage<UserProgress[]>('quiz-progress', []);
  
  const category = categoryId ? getQuizCategory(categoryId) : null;
  const level = categoryId && levelId ? getQuizLevel(categoryId, levelId) : null;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    if (level) {
      setUserAnswers(new Array(level.questions.length).fill(null));
    }
  }, [level]);

  if (!category || !level) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Quiz Not Found</h1>
          <Button onClick={() => navigate('/')} variant="default">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = level.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === level.questions.length - 1;
  const progressPercentage = ((currentQuestionIndex + 1) / level.questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return;
    
    setSelectedAnswer(answerIndex);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Calculate final results
      const correctAnswers = userAnswers.filter((answer, index) => 
        answer === level.questions[index].correctAnswer
      ).length;
      
      const percentage = (correctAnswers / level.questions.length) * 100;
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      // Save progress
      const newProgress = progress.filter(p => 
        !(p.categoryId === categoryId && p.levelId === levelId)
      );
      
      newProgress.push({
        categoryId: categoryId!,
        levelId: levelId!,
        completed: true,
        score: correctAnswers,
        percentage,
        timestamp: Date.now()
      });
      
      setProgress(newProgress);
      
      // Navigate to results
      navigate(`/results/${categoryId}/${levelId}`, {
        state: {
          score: correctAnswers,
          totalQuestions: level.questions.length,
          percentage,
          timeSpent,
          userAnswers
        }
      });
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setQuestionStartTime(Date.now());
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-card border-b border-border shadow-soft z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(`/category/${categoryId}`)}
              className="flex items-center space-x-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Exit Quiz</span>
            </Button>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {level.questions.length}
              </div>
              <div className="font-semibold">{category.name} - Level {level.levelNumber}</div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FaClock className="w-4 h-4" />
              <span>{Math.floor((Date.now() - questionStartTime) / 1000)}s</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-secondary rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-2 bg-gradient-primary rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Question */}
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-3xl font-bold mb-6"
              >
                {currentQuestion.question}
              </motion.h1>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = index === currentQuestion.correctAnswer;
                
                let buttonVariant = "outline";
                let iconColor = "";
                let Icon = null;
                
                if (showAnswer) {
                  if (isCorrectOption) {
                    buttonVariant = "success";
                    Icon = FaCheck;
                    iconColor = "text-success-foreground";
                  } else if (isSelected && !isCorrectOption) {
                    buttonVariant = "destructive";
                    Icon = FaTimes;
                    iconColor = "text-destructive-foreground";
                  }
                } else if (isSelected) {
                  buttonVariant = "default";
                }

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={showAnswer ? {} : { scale: 1.02 }}
                    whileTap={showAnswer ? {} : { scale: 0.98 }}
                  >
                    <Button
                      variant={buttonVariant as any}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showAnswer}
                      className="w-full h-auto p-6 text-left justify-start text-wrap"
                      size="lg"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="flex-1 text-base">{option}</span>
                        {showAnswer && Icon && (
                          <Icon className={`w-5 h-5 ml-4 ${iconColor}`} />
                        )}
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Answer Explanation */}
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-card border border-border rounded-xl p-6 shadow-soft"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${isCorrect ? 'bg-success/20' : 'bg-destructive/20'}`}>
                      <FaLightbulb className={`w-5 h-5 ${isCorrect ? 'text-success' : 'text-destructive'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </h3>
                      <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <Button
                  onClick={handleNextQuestion}
                  variant="default"
                  size="lg"
                  className="group"
                >
                  {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                  <motion.div
                    className="ml-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaArrowRight className="w-4 h-4" />
                  </motion.div>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;