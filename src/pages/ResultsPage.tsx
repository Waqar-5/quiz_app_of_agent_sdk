import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrophy, FaClock, FaArrowRight, FaHome, FaRedo, FaCheck, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { getQuizLevel, getQuizCategory } from '@/data/quizData';

const ResultsPage = () => {
  const { categoryId, levelId } = useParams<{ categoryId: string; levelId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const category = categoryId ? getQuizCategory(categoryId) : null;
  const level = categoryId && levelId ? getQuizLevel(categoryId, levelId) : null;
  
  const results = location.state as {
    score: number;
    totalQuestions: number;
    percentage: number;
    timeSpent: number;
    userAnswers: (number | null)[];
  };

  if (!category || !level || !results) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Results Not Found</h1>
          <Button onClick={() => navigate('/')} variant="default">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, percentage, timeSpent, userAnswers } = results;
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Outstanding! 🎉';
    if (percentage >= 80) return 'Excellent work! 👏';
    if (percentage >= 70) return 'Good job! 👍';
    if (percentage >= 60) return 'Not bad! 🙂';
    return 'Keep practicing! 💪';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Find next level
  const currentLevelIndex = category.levels.findIndex(l => l.id === levelId);
  const nextLevel = currentLevelIndex < category.levels.length - 1 ? category.levels[currentLevelIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex p-6 bg-gradient-primary rounded-full shadow-glow mb-6"
          >
            <FaTrophy className="w-16 h-16 text-primary-foreground" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Quiz Complete!</h1>
          <p className="text-xl text-muted-foreground">
            {category.name} - Level {level.levelNumber}
          </p>
        </motion.div>

        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-card border border-border rounded-2xl p-8 shadow-large mb-8"
        >
          <div className="text-center">
            <div className={`text-6xl md:text-7xl font-bold mb-4 ${getScoreColor()}`}>
              {percentage.toFixed(1)}%
            </div>
            <div className="text-2xl font-semibold mb-2">{getScoreMessage()}</div>
            <div className="text-muted-foreground">
              {score} out of {totalQuestions} questions correct
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-card border border-border rounded-xl p-6 text-center shadow-soft">
            <div className="text-3xl font-bold text-success mb-2">{score}</div>
            <div className="text-muted-foreground">Correct Answers</div>
          </div>
          
          <div className="bg-gradient-card border border-border rounded-xl p-6 text-center shadow-soft">
            <div className="text-3xl font-bold text-destructive mb-2">{totalQuestions - score}</div>
            <div className="text-muted-foreground">Incorrect Answers</div>
          </div>
          
          <div className="bg-gradient-card border border-border rounded-xl p-6 text-center shadow-soft">
            <div className="flex items-center justify-center space-x-2 text-3xl font-bold text-primary mb-2">
              <FaClock className="w-6 h-6" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <div className="text-muted-foreground">Time Spent</div>
          </div>
        </motion.div>

        {/* Question Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-card border border-border rounded-xl p-6 shadow-soft mb-8"
        >
          <h3 className="text-2xl font-bold mb-6">Question Review</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-20 gap-2">
            {level.questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.02 }}
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold
                    ${isCorrect 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-destructive text-destructive-foreground'
                    }
                  `}
                  title={`Question ${index + 1}: ${isCorrect ? 'Correct' : 'Incorrect'}`}
                >
                  {isCorrect ? <FaCheck className="w-3 h-3" /> : <FaTimes className="w-3 h-3" />}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {nextLevel && percentage >= 60 && (
            <Link to={`/quiz/${categoryId}/${nextLevel.id}`}>
              <Button variant="default" size="lg" className="group">
                Next Level
                <motion.div
                  className="ml-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaArrowRight className="w-4 h-4" />
                </motion.div>
              </Button>
            </Link>
          )}
          
          <Link to={`/quiz/${categoryId}/${levelId}`}>
            <Button variant="outline" size="lg">
              <FaRedo className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </Link>
          
          <Link to={`/category/${categoryId}`}>
            <Button variant="outline" size="lg">
              Back to Levels
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="ghost" size="lg">
              <FaHome className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </motion.div>

        {/* Encouragement Message */}
        {percentage < 60 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 text-center bg-gradient-card border border-border rounded-xl p-6 shadow-soft"
          >
            <p className="text-muted-foreground">
              Need at least 60% to unlock the next level. Keep studying and try again!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;