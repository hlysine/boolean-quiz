import React from 'react';

import Formula from './formula';
import { TruthTable } from './truthTable';

interface TruthTableCellProps {
  children: React.ReactNode;
  header?: boolean;
  className?: string;
}

interface TruthTableViewProps {
  truthTable: TruthTable;
  formula?: Formula;
}

function TruthTableCell({ children, header, className }: TruthTableCellProps) {
  if (header) {
    return <th className={`border border-cyan-900 p-1 ${className ?? ''}`}>{children}</th>;
  } else {
    return <td className={`border border-cyan-900 p-1 ${className ?? ''}`}>{children}</td>;
  }
}

export default function TruthTableView({ truthTable, formula }: TruthTableViewProps) {
  return (
    <table className="border-cyan-900 border">
      <thead>
        <tr>
          {Object.keys(truthTable.rows[0].inputs).map(key => (
            <TruthTableCell key={key} header className="min-w-[50px]">
              {key}
            </TruthTableCell>
          ))}
          <TruthTableCell header className="min-w-[50px]">
            Output
          </TruthTableCell>
          {formula ? (
            <TruthTableCell header className="min-w-[50px]">
              Formula
            </TruthTableCell>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {truthTable.rows.map((row, idx) => (
          <tr key={idx}>
            {Object.values(row.inputs).map((col, idx2) => (
              <TruthTableCell key={idx2}>{col ? '1' : '0'}</TruthTableCell>
            ))}
            <TruthTableCell>{row.output ? '1' : '0'}</TruthTableCell>
            {formula
              ? (() => {
                  try {
                    const result = formula.evaluate(row.inputs);
                    return (
                      <TruthTableCell className={result === row.output ? 'bg-green-300' : 'bg-red-300'}>
                        {result ? '1' : '0'}
                      </TruthTableCell>
                    );
                  } catch (ex) {
                    return <TruthTableCell className="bg-red-300">E</TruthTableCell>;
                  }
                })()
              : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
