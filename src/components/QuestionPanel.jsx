import React, { useState } from 'react';
import AnswerSection from './AnswerSection';


const QuestionPanel = ({ onClose }) => {
  const [question, setQuestion] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = () => {
    if (question.trim()) {
      setShowAnswer(true);
    }
  };

  return (
    <div className="flex flex-col w-[30%] h-full">
      <div className="bg-white rounded-xl border border-gray-200 p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="mb-6">
          <h3 className="font-medium mb-2">Transcript at time of question (00:45)</h3>
          <p className="p-3 bg-gray-50 rounded">"Welcome to today's training session."</p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Your Question</h3>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Type your question here..."
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-6 py-2 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Submit Question
          </button>
        </div>
        
        {showAnswer && <AnswerSection onClose={onClose} />}
      </div>
    </div>
  );
};

export default QuestionPanel;