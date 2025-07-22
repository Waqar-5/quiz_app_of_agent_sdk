import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBrain, FaRocket, FaArrowRight, FaTrophy } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { QuizCategory } from '@/types/quiz';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserProgress } from '@/types/quiz';

interface CategoryCardProps {
  category: QuizCategory;
  index: number;
}

const iconMap = {
  FaGraduationCap,
  FaBrain,
  FaRocket,
};

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  const [progress] = useLocalStorage<UserProgress[]>('quiz-progress', []);
  
  const Icon = iconMap[category.icon as keyof typeof iconMap] || FaBrain;
  
  // Calculate completion stats
  const categoryProgress = progress.filter(p => p.categoryId === category.id);
  const completedLevels = categoryProgress.filter(p => p.completed).length;
  const totalLevels = category.levels.length;
  const completionPercentage = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;
  
  const averageScore = categoryProgress.length > 0 
    ? categoryProgress.reduce((sum, p) => sum + (p.percentage || 0), 0) / categoryProgress.length 
    : 0;

  const getDifficultyColor = () => {
    switch (category.difficulty) {
      case 'beginner': return 'text-success';
      case 'intermediate': return 'text-warning';
      case 'advanced': return 'text-primary';
      default: return 'text-primary';
    }
  };

  const getDifficultyGradient = () => {
    switch (category.difficulty) {
      case 'beginner': return 'bg-gradient-success';
      case 'intermediate': return 'bg-warning';
      case 'advanced': return 'bg-gradient-primary';
      default: return 'bg-gradient-primary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <div className="relative bg-gradient-card border border-border rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 h-full flex flex-col">
        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getDifficultyColor()} bg-secondary`}>
            {category.difficulty}
          </span>
        </div>

        {/* Icon and Title */}
        <div className="flex items-center space-x-4 mb-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className={`p-4 ${getDifficultyGradient()} rounded-lg shadow-glow`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {totalLevels} levels • {totalLevels * 20} questions
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-6 flex-grow">
          {category.description}
        </p>

        {/* Progress Stats */}
        {categoryProgress.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{completedLevels}/{totalLevels}</span>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`h-2 ${getDifficultyGradient()} rounded-full`}
              />
            </div>

            {averageScore > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <FaTrophy className="w-4 h-4 text-warning" />
                <span className="text-muted-foreground">Average Score:</span>
                <span className="font-semibold">{averageScore.toFixed(1)}%</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Link to={`/category/${category.id}`} className="mt-auto">
          <Button 
            variant="quiz" 
            className="w-full group"
            size="lg"
          >
            <span>{completedLevels > 0 ? 'Continue Learning' : 'Start Learning'}</span>
            <motion.div
              className="ml-2"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FaArrowRight className="w-4 h-4" />
            </motion.div>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default CategoryCard;