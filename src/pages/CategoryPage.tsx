import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaGraduationCap, FaBrain, FaRocket, FaPlay, FaCheck, FaTrophy, FaLock } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { getQuizCategory } from '@/data/quizData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserProgress } from '@/types/quiz';

const iconMap = {
  FaGraduationCap,
  FaBrain,
  FaRocket,
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [progress] = useLocalStorage<UserProgress[]>('quiz-progress', []);
  
  const category = categoryId ? getQuizCategory(categoryId) : null;

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <Link to="/">
            <Button variant="default">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[category.icon as keyof typeof iconMap] || FaBrain;
  
  // Get progress for this category
  const categoryProgress = progress.filter(p => p.categoryId === category.id);
  const getProgressForLevel = (levelId: string) => {
    return categoryProgress.find(p => p.levelId === levelId);
  };

  const getDifficultyGradient = () => {
    switch (category.difficulty) {
      case 'beginner': return 'bg-gradient-success';
      case 'intermediate': return 'bg-warning';
      case 'advanced': return 'bg-gradient-primary';
      default: return 'bg-gradient-primary';
    }
  };

  const getDifficultyColor = () => {
    switch (category.difficulty) {
      case 'beginner': return 'text-success';
      case 'intermediate': return 'text-warning';
      case 'advanced': return 'text-primary';
      default: return 'text-primary';
    }
  };

  // Check if a level is unlocked (level 1 is always unlocked, others require previous level completion)
  const isLevelUnlocked = (levelIndex: number) => {
    if (levelIndex === 0) return true; // First level is always unlocked
    const previousLevel = category.levels[levelIndex - 1];
    const previousProgress = getProgressForLevel(previousLevel.id);
    return previousProgress?.completed || false;
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8">
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Categories</span>
            </Link>

            {/* Category Header */}
            <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8 mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`p-6 ${getDifficultyGradient()} rounded-2xl shadow-glow`}
              >
                <Icon className="w-16 h-16 text-white" />
              </motion.div>

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-bold">{category.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getDifficultyColor()} bg-secondary`}>
                      {category.difficulty}
                    </span>
                  </div>
                  <p className="text-xl text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <span>{category.levels.length} Levels</span>
                    <span>{category.levels.length * 20} Questions</span>
                    <span>{categoryProgress.filter(p => p.completed).length}/{category.levels.length} Completed</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Levels Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Choose Your Level</h2>
            <p className="text-muted-foreground">
              Complete levels in order to unlock new challenges. Each level contains 20 questions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {category.levels.map((level, index) => {
              const levelProgress = getProgressForLevel(level.id);
              const isCompleted = levelProgress?.completed || false;
              const isUnlocked = isLevelUnlocked(index);
              const score = levelProgress?.percentage || 0;

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
                  className="relative"
                >
                  <div className={`
                    relative bg-gradient-card border rounded-xl p-6 shadow-soft transition-all duration-300
                    ${isUnlocked ? 'border-border hover:shadow-medium cursor-pointer' : 'border-muted opacity-50'}
                    ${isCompleted ? 'border-success/50 bg-gradient-to-br from-success/5 to-transparent' : ''}
                  `}>
                    {/* Status Icon */}
                    <div className="absolute top-4 right-4">
                      {isCompleted ? (
                        <div className="p-2 bg-success rounded-full">
                          <FaCheck className="w-4 h-4 text-success-foreground" />
                        </div>
                      ) : isUnlocked ? (
                        <div className="p-2 bg-primary/20 rounded-full">
                          <FaPlay className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <div className="p-2 bg-muted rounded-full">
                          <FaLock className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Level Info */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2">Level {level.levelNumber}</h3>
                      <p className="text-sm text-muted-foreground">20 Questions</p>
                    </div>

                    {/* Score Display */}
                    {isCompleted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex items-center space-x-2"
                      >
                        <FaTrophy className="w-4 h-4 text-warning" />
                        <span className="text-sm font-semibold">{score.toFixed(1)}%</span>
                      </motion.div>
                    )}

                    {/* Action Button */}
                    {isUnlocked ? (
                      <Link to={`/quiz/${category.id}/${level.id}`}>
                        <Button 
                          variant={isCompleted ? "success" : "default"} 
                          className="w-full"
                          size="sm"
                        >
                          {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" size="sm" disabled>
                        Locked
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;