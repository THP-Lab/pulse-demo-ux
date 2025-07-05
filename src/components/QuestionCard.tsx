import React, { useState, useRef, useEffect } from "react";
import type { Question } from "../types/index";
import { Button } from "@/components/ui/button";

interface QuestionCardProps {
  question: Question;
  onVote: (vote: "like" | "dislike") => void;
  onSwipe: (direction: "left" | "right") => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onVote,
  onSwipe,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset.x) > 100) {
      const direction = dragOffset.x > 0 ? "right" : "left";
      onSwipe(direction);
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset.x) > 100) {
      const direction = dragOffset.x > 0 ? "right" : "left";
      onSwipe(direction);
    }
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);


  const cardStyle = {
    transform: isDragging 
      ? `rotate(${dragOffset.x * 0.1}deg) translate(${dragOffset.x * 0.3}px, ${dragOffset.y * 0.4}px)` 
      : "none",
    cursor: isDragging ? "grabbing" : "grab",
    transition: isDragging ? "none" : "transform 0.3s ease",
    minHeight: "250px",
    transformOrigin: "center",
    backgroundColor: isDragging 
      ? dragOffset.x > 50 
        ? `rgba(34, 197, 94, ${Math.min(Math.abs(dragOffset.x) / 200, 0.1)})` // Vert pour "oui"
        : dragOffset.x < -50 
          ? `rgba(239, 68, 68, ${Math.min(Math.abs(dragOffset.x) / 200, 0.1)})` // Rouge pour "non"
          : "white"
      : "white",
  };

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Carte principale */}
      <div 
        ref={cardRef}
        className="bg-white rounded-2xl shadow-lg p-4 md:p-6 w-full max-w-2xl mx-auto flex flex-col"
        style={cardStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="text-center mb-6 mt-6 flex-1 flex flex-col justify-center">
          <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-medium mb-4">
            {question.category}
          </div>
          <p className="text-lg md:text-xl text-gray-800 leading-relaxed flex-1 px-2">
            {question.question}
          </p>
        </div>
      </div>

      {/* Skip button - same width as the card */}
      <div className="flex justify-center w-full max-w-2xl mt-6">
        <Button
          onClick={() => onVote("dislike")}
          size="lg"
          className="w-full py-4 text-lg bg-black text-white hover:bg-gray-900"
        >
          Skip
        </Button>
      </div>
    </div>
  );
};

export default QuestionCard;