import React, { useMemo, useState } from 'react';

import generateQuestion from './quiz/questions/questionGenerator';

function App() {
  const [question, setQuestion] = useState(generateQuestion());
  const QuestionComponent = useMemo(() => question.createQuestionComponent(), [question]);
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-md shadow-xl p-4 bg-slate-100 w-full m-4 lg:w-[50%]">
        <QuestionComponent />
        <button
          type="button"
          className="mt-4 w-full bg-slate-600 text-white rounded-md shadow-md p-2 hover:bg-slate-500 transition-all"
          onClick={() => setQuestion(generateQuestion())}
        >
          New Question
        </button>
      </div>
    </div>
  );
}

export default App;
