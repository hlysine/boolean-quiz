import Question from './question';
import WriteFormulaQuestion from './WriteFormulaQuestion';

const generators = [WriteFormulaQuestion.generate];

export default function generateQuestion(): Question {
  const idx = Math.floor(Math.random() * generators.length);
  return generators[idx]();
}
