import React, { useEffect, useMemo, useState } from 'react';

import Question from './quiz/questions/question';
import generateQuestion from './quiz/questions/questionGenerator';

function App() {
  const [question, setQuestion] = useState(generateQuestion());
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setCorrect] = useState(false);
  const QuestionComponent = useMemo(() => question.createQuestionComponent(), [question]);
  const AnswerComponent = useMemo(() => question.createAnswerComponent(), [question]);

  const reset = () => {
    setShowAnswer(false);
    setCorrect(false);
    setQuestion(generateQuestion());
  };

  const onResult = (_q: Question, correct: boolean) => {
    if (correct) setCorrect(true);
  };

  useEffect(() => {
    question.onResult(onResult);
  }, [question]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div
        className={`rounded-md shadow-xl p-4 bg-slate-100 w-full m-4 mt-0 lg:w-[50%] ${
          isCorrect ? 'shadow-green-400' : ''
        }`}
      >
        <QuestionComponent />
        <hr className="mt-4"></hr>
        <div className="w-full min-h-[100px] flex flex-col justify-center items-center border-dashed border-4 mt-4">
          {showAnswer ? (
            <AnswerComponent />
          ) : (
            <button
              type="button"
              className="w-full h-full text-slate-400 font-bold font-mono text-xl p-4"
              onClick={() => setShowAnswer(true)}
            >
              {isCorrect ? (
                <>
                  Correct!
                  <br />
                </>
              ) : (
                ''
              )}
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
