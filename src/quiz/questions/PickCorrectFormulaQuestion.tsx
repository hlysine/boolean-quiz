import React, { useMemo, useState } from 'react';
import Latex from 'react-latex-next';

import Formula from '../formula';
import FormulaButton from '../FormulaButton';
import tweakFormula from '../formulaTweaker';
import { TruthTable, TruthTableRow } from '../truthTable';
import TruthTableView from '../TruthTableView';
import Question from './question';

export default class PickCorrectFormulaQuestion extends Question {
  private truthTable: TruthTable;

  private choices: Formula[];

  private correctChoice: Formula;

  private constructor(truthTable: TruthTable, choices: Formula[], correctChoice: Formula) {
    super();
    this.truthTable = truthTable;
    this.choices = choices;
    this.correctChoice = correctChoice;
  }

  public override createQuestionComponent() {
    return () => {
      const [selected, setSelected] = useState<Formula>();
      const onSelect = (formula: Formula) => {
        setSelected(formula);
        this.emitResult(formula === this.correctChoice);
      };
      return (
        <div className="flex flex-col gap-1">
          <p className="m-2">Given the truth table below:</p>
          <TruthTableView truthTable={this.truthTable} />
          <p className="m-2">What is the binary logic formula?</p>
          {this.choices.map((choice, idx) => (
            <FormulaButton
              key={idx}
              formula={choice}
              selected={choice === selected}
              isCorrect={choice === selected ? choice === this.correctChoice : undefined}
              onClick={onSelect}
            />
          ))}
        </div>
      );
    };
  }

  public override createAnswerComponent() {
    return () => {
      const correctChoice = this.correctChoice;
      const latex = useMemo(() => correctChoice.toLatex(), [correctChoice]);
      return <Latex>{latex}</Latex>;
    };
  }

  public static generate(): PickCorrectFormulaQuestion {
    const rows: TruthTableRow[] = [];
    for (let a = 0; a <= 1; a++) {
      for (let b = 0; b <= 1; b++) {
        for (let c = 0; c <= 1; c++) {
          rows.push({ inputs: { A: !!a, B: !!b, C: !!c }, output: Math.random() >= 0.5 });
        }
      }
    }
    const truthTable = new TruthTable(rows);
    const answers: Formula[] = [];
    const correctAnswer = truthTable.generateFormula();
    for (let i = 0; i < 4; i++) {
      let incorrectAnswer = tweakFormula(correctAnswer);
      while (truthTable.verifyFormula(incorrectAnswer)) {
        incorrectAnswer = tweakFormula(correctAnswer);
      }
      answers.push(incorrectAnswer);
    }
    answers.splice(Math.floor(Math.random() * answers.length), 0, correctAnswer);
    return new PickCorrectFormulaQuestion(truthTable, answers, correctAnswer);
  }
}
