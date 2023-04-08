import React from 'react';

import { TruthTable } from './truthTable';

interface TruthTableViewProps {
  truthTable: TruthTable;
}

export default function TruthTableView({ truthTable }: TruthTableViewProps) {
  return (
    <table className="border-cyan-900 border">
      <tr>
        {Object.keys(truthTable.rows[0].inputs).map(key => (
          <th className="border-cyan-900 border p-1">{key}</th>
        ))}
        <th className="border-cyan-900 border p-1">Output</th>
      </tr>
      {truthTable.rows.map(row => (
        <tr>
          {Object.values(row.inputs).map(col => (
            <td className="border-cyan-900 border p-1">{col.toString()}</td>
          ))}
          <td className="border-cyan-900 border p-1">{row.output.toString()}</td>
        </tr>
      ))}
    </table>
  );
}
