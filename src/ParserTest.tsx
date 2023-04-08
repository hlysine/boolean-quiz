import { useMemo, useState } from 'react';
import React from 'react';

import { parseFormula } from './quiz/parser';
import { TruthTable } from './quiz/truthTable';
import TruthTableView from './quiz/TruthTableView';

export default function ParserTest() {
  const [text, setText] = useState('');
  const formula = useMemo(() => {
    try {
      const result = parseFormula(text);
      console.log(result.node.toString(), result.node.toLatex(), result);
      return result;
    } catch (ex) {
      console.log(ex);
      return undefined;
    }
  }, [text]);
  const truthTable = useMemo(() => (formula ? TruthTable.createTruthTable(formula) : undefined), [formula]);
  console.log(truthTable);
  return (
    <div>
      <input type="text" value={text} onChange={e => setText(e.currentTarget.value)} className="border"></input>
      {truthTable ? <TruthTableView truthTable={truthTable} /> : null}
    </div>
  );
}
