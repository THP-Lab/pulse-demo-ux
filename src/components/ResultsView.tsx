import React from "react";
import { Button } from "@/components/ui/button";
import type { Question, UserVote } from "../types/index";

interface VoteStats {
  like: number;
  dislike: number;
}

interface ResultsViewProps {
  voteStats: VoteStats;
  selectedQuestions: Question[];
  getVoteForQuestion: (questionId: string) => UserVote | undefined;
  onRestart: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ 
  selectedQuestions, 
  getVoteForQuestion, 
  onRestart 
}) => {
  return (
    <div className="min-h-screen from-green-50 to-blue-50 overflow-auto">
      <div className="flex justify-center items-start w-full px-2 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src="/logo.png" alt="Pulse Logo" className="w-20" />
              <h1 className="text-5xl font-bold text-gray-800">Pulse</h1>
            </div>
            <p className="text-lg text-gray-600">Your Results</p>
          </header>

          {/* Question Review */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Pulse vs Community Pulse</h3>
            <div className="space-y-6">
              {selectedQuestions.map((question, index) => {
                const vote = getVoteForQuestion(question.id);
                const voteLabel = vote?.vote === "like" ? "Yes" : "No";
                const voteColor =
                  vote?.vote === "like"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800";

                const communityStats = question.communityStats;
                const isUserAgreeingWithCommunity = communityStats && vote && 
                  ((vote.vote === 'like' && communityStats.like > 50) ||
                   (vote.vote === 'dislike' && communityStats.dislike > 50));

                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-2">Question {index + 1}</div>
                      <p className="text-gray-800 text-lg">{question.question}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* User's Answer */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-3">Votre réponse</h4>
                        <div className="flex items-center justify-between">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${voteColor}`}>
                            {voteLabel}
                          </span>
                          {communityStats && (
                            <div className="text-sm text-gray-500">
                              {isUserAgreeingWithCommunity ? (
                                <span className="text-green-600">✓ Pulsing with the Community</span>
                              ) : (
                                <span className="text-orange-600">⚠ You're not pulsing with the community</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Community Stats */}
                      {communityStats && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-3">Community Pulse</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Yes</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${communityStats.like}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 w-8">{communityStats.like}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">No</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-red-500 h-2 rounded-full" 
                                    style={{ width: `${communityStats.dislike}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 w-8">{communityStats.dislike}%</span>
                              </div>
                            </div>

                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Total: {communityStats.totalVotes.toLocaleString()} Pulse
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Restart Button */}
          <div className="text-center">
            <Button onClick={onRestart} size="lg" 
            className="px-8 py-3 text-lg w-full max-w-md">
              Start a New Pulse Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
