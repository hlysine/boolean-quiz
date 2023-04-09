import PickCorrectFormulaQuestion from './PickCorrectFormulaQuestion';
import Question from './question';
import WriteFormulaQuestion from './WriteFormulaQuestion';

const generators = [WriteFormulaQuestion.generate, PickCorrectFormulaQuestion.generate];

export default function generateQuestion(): Question {
  const idx = Math.floor(Math.random() * generators.length);
  return generators[idx]();
}
