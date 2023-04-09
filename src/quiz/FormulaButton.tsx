import React, { useMemo } from 'react';
import Latex from 'react-latex-next';

import Formula from './formula';

interface FormulaButtonProps {
  formula: Formula;
  isCorrect?: boolean | undefined;
  selected?: boolean;
  onClick?: (formula: Formula) => void;
}

export default function FormulaButton({ formula, isCorrect, selected, onClick }: FormulaButtonProps) {
  const latex = useMemo(() => formula.toLatex(), [formula]);
  return (
    <button
      type="button"
      className={`rounded-md p-2 shadow-sm hover:bg-slate-50 transition-all ${
        selected ? 'bg-slate-50 border-4' : 'bg-slate-100 border'
      } ${isCorrect ? 'border-green-400' : isCorrect === false ? 'border-red-400' : ''}`}
      onClick={() => onClick?.(formula)}
    >
      <Latex>{latex}</Latex>
    </button>
  );
}
