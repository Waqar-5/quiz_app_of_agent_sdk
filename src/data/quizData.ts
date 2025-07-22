import { QuizCategory } from '@/types/quiz';

// Helper function to generate quiz questions for different levels
const generateQuestions = (category: string, level: number, count: number = 20) => {
  const baseQuestions = {
    beginner: {
      1: [
        {
          id: 'b1q1',
          question: 'What does AI stand for?',
          options: ['Artificial Intelligence', 'Automated Intelligence', 'Advanced Intelligence', 'Applied Intelligence'],
          correctAnswer: 0,
          explanation: 'AI stands for Artificial Intelligence, which refers to computer systems that can perform tasks typically requiring human intelligence.'
        },
        {
          id: 'b1q2',
          question: 'Which company created ChatGPT?',
          options: ['Google', 'Microsoft', 'OpenAI', 'Meta'],
          correctAnswer: 2,
          explanation: 'ChatGPT was created by OpenAI, a leading AI research company.'
        },
        {
          id: 'b1q3',
          question: 'What is machine learning?',
          options: ['A type of computer hardware', 'A subset of AI that learns from data', 'A programming language', 'A web browser'],
          correctAnswer: 1,
          explanation: 'Machine learning is a subset of AI that enables computers to learn and improve from data without being explicitly programmed.'
        },
        {
          id: 'b1q4',
          question: 'What does "prompt" mean in AI context?',
          options: ['A quick response', 'Input text given to an AI model', 'A type of AI model', 'An error message'],
          correctAnswer: 1,
          explanation: 'A prompt is the input text or instruction given to an AI model to generate a response.'
        },
        {
          id: 'b1q5',
          question: 'What is Natural Language Processing (NLP)?',
          options: ['A programming language', 'AI technology for understanding human language', 'A type of computer', 'A web development tool'],
          correctAnswer: 1,
          explanation: 'NLP is a branch of AI that helps computers understand, interpret, and generate human language.'
        }
      ]
    },
    intermediate: {
      1: [
        {
          id: 'i1q1',
          question: 'What is the transformer architecture?',
          options: ['A type of robot', 'A neural network architecture', 'A programming framework', 'A data structure'],
          correctAnswer: 1,
          explanation: 'The transformer is a neural network architecture that revolutionized NLP and forms the basis of models like GPT.'
        },
        {
          id: 'i1q2',
          question: 'What does GPT stand for?',
          options: ['General Purpose Technology', 'Generative Pre-trained Transformer', 'Global Processing Tool', 'Graphical Programming Tool'],
          correctAnswer: 1,
          explanation: 'GPT stands for Generative Pre-trained Transformer, a type of language model architecture.'
        },
        {
          id: 'i1q3',
          question: 'What is fine-tuning in AI?',
          options: ['Adjusting hardware settings', 'Training a pre-trained model on specific data', 'Debugging code', 'Optimizing performance'],
          correctAnswer: 1,
          explanation: 'Fine-tuning involves training a pre-trained model on specific data to adapt it for particular tasks.'
        },
        {
          id: 'i1q4',
          question: 'What is the attention mechanism?',
          options: ['A focus technique', 'A way for models to focus on relevant parts of input', 'A meditation practice', 'A user interface feature'],
          correctAnswer: 1,
          explanation: 'The attention mechanism allows models to focus on different parts of the input when generating each part of the output.'
        },
        {
          id: 'i1q5',
          question: 'What is reinforcement learning?',
          options: ['Learning from rewards and penalties', 'Memorizing information', 'Copying other models', 'Reading documentation'],
          correctAnswer: 0,
          explanation: 'Reinforcement learning is a type of machine learning where agents learn through interaction with an environment using rewards and penalties.'
        }
      ]
    },
    advanced: {
      1: [
        {
          id: 'a1q1',
          question: 'What is the primary challenge addressed by Constitutional AI?',
          options: ['Model size optimization', 'Alignment and safety', 'Training speed', 'Data efficiency'],
          correctAnswer: 1,
          explanation: 'Constitutional AI addresses the challenge of making AI systems more aligned with human values and safer to deploy.'
        },
        {
          id: 'a1q2',
          question: 'What is the vanishing gradient problem?',
          options: ['Colors becoming less visible', 'Gradients becoming too small to update weights effectively', 'Memory running out', 'Code optimization'],
          correctAnswer: 1,
          explanation: 'The vanishing gradient problem occurs when gradients become exponentially small, making it difficult to train deep neural networks.'
        },
        {
          id: 'a1q3',
          question: 'What is RLHF in AI development?',
          options: ['Real-time Learning Heavy Framework', 'Reinforcement Learning from Human Feedback', 'Rapid Language Handling Function', 'Recursive Logic for High Frequency'],
          correctAnswer: 1,
          explanation: 'RLHF (Reinforcement Learning from Human Feedback) is a technique used to train AI models using human preferences and feedback.'
        },
        {
          id: 'a1q4',
          question: 'What is the purpose of layer normalization?',
          options: ['To make layers the same size', 'To stabilize and accelerate training', 'To reduce model complexity', 'To prevent overfitting'],
          correctAnswer: 1,
          explanation: 'Layer normalization helps stabilize training and can accelerate convergence by normalizing inputs across features.'
        },
        {
          id: 'a1q5',
          question: 'What is few-shot learning?',
          options: ['Learning with minimal examples', 'Fast training techniques', 'Short training sessions', 'Quick decision making'],
          correctAnswer: 0,
          explanation: 'Few-shot learning is the ability of a model to learn new tasks with only a few examples, often leveraging prior knowledge.'
        }
      ]
    }
  };

  // Generate additional questions by modifying base questions
  const categoryQuestions = baseQuestions[category as keyof typeof baseQuestions]?.[level] || baseQuestions.beginner[1];
  const questions = [...categoryQuestions];
  
  // Generate more questions to reach the target count
  while (questions.length < count) {
    const baseQuestion = categoryQuestions[questions.length % categoryQuestions.length];
    const newQuestion = {
      ...baseQuestion,
      id: `${category[0]}${level}q${questions.length + 1}`,
      question: `${baseQuestion.question} (Variation ${Math.floor(questions.length / categoryQuestions.length) + 1})`,
    };
    questions.push(newQuestion);
  }
  
  return questions.slice(0, count);
};

// Generate levels for each category
const generateLevels = (category: string, count: number = 10) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `${category}-level-${index + 1}`,
    levelNumber: index + 1,
    title: `Level ${index + 1}`,
    questions: generateQuestions(category, index + 1)
  }));
};

export const quizCategories: QuizCategory[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Perfect for those new to AI and OpenAI technologies. Learn the fundamentals and basic concepts.',
    difficulty: 'beginner',
    levels: generateLevels('beginner'),
    color: 'success',
    icon: 'FaGraduationCap'
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'For those with some AI knowledge. Dive deeper into machine learning concepts and techniques.',
    difficulty: 'intermediate',
    levels: generateLevels('intermediate'),
    color: 'warning',
    icon: 'FaBrain'
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Advanced concepts for AI practitioners. Explore cutting-edge research and complex implementations.',
    difficulty: 'advanced',
    levels: generateLevels('advanced'),
    color: 'primary',
    icon: 'FaRocket'
  }
];

export const getQuizCategory = (categoryId: string) => {
  return quizCategories.find(category => category.id === categoryId);
};

export const getQuizLevel = (categoryId: string, levelId: string) => {
  const category = getQuizCategory(categoryId);
  return category?.levels.find(level => level.id === levelId);
};