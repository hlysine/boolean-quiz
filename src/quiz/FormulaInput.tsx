import React from 'react';
import { useState } from 'react';
import Latex from 'react-latex-next';

import Formula from './formula';
import { parseFormula } from './parser';

interface FormulaInputProps {
  onChange: (formula: Formula) => void;
}

export default function FormulaInput({ onChange }: FormulaInputProps) {
  const [error, setError] = useState<string>();
  const [latex, setLatex] = useState<string>();

  const changeHandler = (text: string) => {
    try {
      const formula = parseFormula(text);
      setLatex(formula.toLatex());
      setError(undefined);
      onChange(formula);
    } catch (ex) {
      if (ex instanceof Error) {
        setLatex(undefined);
        setError(ex.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <textarea
        spellCheck={false}
        rows={1}
        placeholder="Type formula here..."
        autoFocus={true}
        onChange={e => changeHandler(e.target.value)}
        className="resize-none rounded-md p-2 font-mono border w-full"
      ></textarea>
      {latex ? <Latex>{latex}</Latex> : null}
      {error ? <p>{error}</p> : null}
    </div>
  );
}
