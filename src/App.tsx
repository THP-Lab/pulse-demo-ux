import { useState, useEffect } from "react";
import type { AppData, Question, UserVote } from "./types/index";
import QuestionCard from "./components/QuestionCard";
import ProgressBar from "./components/ProgressBar";
import ErrorState from "./components/ErrorState";
import ResultsView from "./components/ResultsView";
import "./App.css";
import LoadingSpinner from "./components/LoadingSpinner";
import Logo from "./components/ui/Logo";
import { useRef } from "react";

function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [logoLoading, setLogoLoading] = useState(false);

  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then((data: AppData) => {
        setData(data);
        setIsLoading(false);
        // Sélectionner 5 questions aléatoires au chargement
        selectRandomQuestions(data.questions);
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setIsLoading(false);
      });
  }, []);

  const selectRandomQuestions = (questions: Question[]) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setSelectedQuestions(selected);
  };

  const handleVote = (vote: 'like' | 'dislike') => {
    if (!data) return;

    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    const newVote: UserVote = {
      questionId: currentQuestion.id,
      vote,
      timestamp: new Date()
    };

    setUserVotes(prev => [...prev, newVote]);
    setLogoLoading(false);
    setTimeout(() => {
      setLogoLoading(true);
      setTimeout(() => setLogoLoading(false), 2000);
    }, 10);
    nextQuestion();
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const vote = direction === 'right' ? 'like' : 'dislike';
    handleVote(vote);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Fin des 5 questions - afficher les résultats
      setShowResults(true);
    }
  };

  const getCurrentQuestion = (): Question | null => {
    return selectedQuestions[currentQuestionIndex] || null;
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setUserVotes([]);
    setShowResults(false);
    if (data) {
      selectRandomQuestions(data.questions);
    }
  };

  const getVoteForQuestion = (questionId: string) => {
    return userVotes.find(vote => vote.questionId === questionId);
  };

  const getVoteStats = () => {
    const totalVotes = userVotes.length;
    const likeCount = userVotes.filter(v => v.vote === 'like').length;
    const dislikeCount = userVotes.filter(v => v.vote === 'dislike').length;

    return {
      like: totalVotes > 0 ? Math.round((likeCount / totalVotes) * 100) : 0,
      dislike: totalVotes > 0 ? Math.round((dislikeCount / totalVotes) * 100) : 0
    };
  };

  const loadQuestions = () => {
    setIsLoading(true);
    fetch('/questions.json')
      .then(response => response.json())
      .then((data: AppData) => {
        setData(data);
        setIsLoading(false);
        selectRandomQuestions(data.questions);
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  if (!data) {
    return <ErrorState onRetry={loadQuestions} />;
  }

  if (showResults) {
    return (
      <ResultsView
        voteStats={getVoteStats()}
        selectedQuestions={selectedQuestions}
        getVoteForQuestion={getVoteForQuestion}
        onRestart={resetGame}
      />
    );
  }

  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) {
    return <ErrorState onRetry={resetGame} />;
  }

  return (
    <div className="min-h-screen from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Logo className="w-16 h-auto" aria-label="Pulse Logo" loading={logoLoading} />
            <h1 className="text-5xl font-bold text-gray-800">Pulse</h1>
          </div>
          <p className="text-lg text-gray-600">Get a Pulse for the Ethereum Application roadmap</p>
        </header>

        <main className="max-w-2xl mx-auto">
          <div className="mb-6">
            <ProgressBar current={currentQuestionIndex + 1} total={5} />
          </div>

          <QuestionCard 
            question={currentQuestion} 
            onVote={handleVote}
            onSwipe={handleSwipe}
          />
        </main>

        <footer className="text-center mt-8">
          <p className="text-sm text-gray-500">Swipe the card to give your pulse</p>
        </footer>
      </div>
    </div>
  );
}

export default App;