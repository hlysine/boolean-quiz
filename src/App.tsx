import React, { useMemo, useState } from 'react';

import generateQuestion from './quiz/questions/questionGenerator';

function App() {
  const [question, setQuestion] = useState(generateQuestion());
  const [showAnswer, setShowAnswer] = useState(false);
  const QuestionComponent = useMemo(() => question.createQuestionComponent(), [question]);
  const AnswerComponent = useMemo(() => question.createAnswerComponent(), [question]);

  const reset = () => {
    setShowAnswer(false);
    setQuestion(generateQuestion());
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-md shadow-xl p-4 bg-slate-100 w-full m-4 lg:w-[50%]">
        <QuestionComponent />
        <div className="w-full min-h-[100px] flex flex-col justify-center items-center border-dashed border-4 mt-4">
          {showAnswer ? (
            <AnswerComponent />
          ) : (
            <button
              type="button"
              className="w-full h-full text-slate-400 font-bold font-mono text-xl p-4"
              onClick={() => setShowAnswer(true)}
            >
              Show Answer
            </button>
          )}
        </div>
        <button
          type="button"
          className="mt-4 w-full bg-slate-600 text-white rounded-md shadow-md p-2 hover:bg-slate-500 transition-all text-lg"
          onClick={reset}
        >
          New Question
        </button>
      </div>
    </div>
  );
}

export default App;
