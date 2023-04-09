import React, { useEffect, useMemo, useState } from 'react';
import Latex from 'react-latex-next';

import Formula from '../formula';
import FormulaInput from '../FormulaInput';
import { TruthTable, TruthTableRow } from '../truthTable';
import TruthTableView from '../TruthTableView';
import Question from './question';

export default class WriteFormulaQuestion extends Question {
  private truthTable: TruthTable;

  private constructor(truthTable: TruthTable) {
    super();
    this.truthTable = truthTable;
  }

  public override createQuestionComponent() {
    return () => {
      const truthTable = this.truthTable;
      const [formula, setFormula] = useState<Formula>();
      useEffect(() => {
        try {
          if (formula) {
            if (truthTable.verifyFormula(formula)) this.emitResult(true);
          }
        } catch (ex) {}
      }, [truthTable, formula]);
      return (
        <div className="flex flex-col gap-1">
          <p className="m-2">Given the follow truth table with inputs A, B & C and output:</p>
          <TruthTableView truthTable={this.truthTable} formula={formula} />
          <p className="m-2">Write the mathematical formula.</p>
          <FormulaInput onChange={e => setFormula(e)} />
        </div>
      );
    };
  }

  public override createAnswerComponent() {
    return () => {
      const truthTable = this.truthTable;
      const latex = useMemo(() => truthTable.generateFormula().toLatex(), [truthTable]);
      return <Latex>{latex}</Latex>;
    };
  }

  public static generate(): WriteFormulaQuestion {
    const rows: TruthTableRow[] = [];
    for (let a = 0; a <= 1; a++) {
      for (let b = 0; b <= 1; b++) {
        for (let c = 0; c <= 1; c++) {
          rows.push({ inputs: { A: !!a, B: !!b, C: !!c }, output: Math.random() >= 0.5 });
        }
      }
    }
    return new WriteFormulaQuestion(new TruthTable(rows));
  }
}
