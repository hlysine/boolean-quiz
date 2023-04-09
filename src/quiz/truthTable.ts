import Formula from './formula';
import { BinaryNode, ConstNode, InputMap, InputNode, NodeType, UnaryNode } from './formulaNode';

export interface TruthTableRow {
  inputs: InputMap;
  output: boolean;
}

export class TruthTable {
  public rows: TruthTableRow[];

  public constructor(rows: TruthTableRow[]) {
    this.rows = rows;
  }

  public verifyFormula(formula: Formula): boolean {
    for (const row of this.rows) {
      if (formula.evaluate(row.inputs) !== row.output) {
        return false;
      }
    }
    return true;
  }

  public generateFormula(): Formula {
    const trueCount = this.rows.reduce((prev, curr) => prev + (curr.output ? 1 : 0), 0);
    const falseCount = this.rows.reduce((prev, curr) => prev + (curr.output ? 0 : 1), 0);
    let children: BinaryNode[];
    const flipped = trueCount > falseCount;
    if (flipped) {
      children = this.rows
        .filter(row => !row.output)
        .map(row => {
          const inputs = Object.entries(row.inputs).map(([input, value]) => {
            if (value) {
              return new InputNode(input);
            } else {
              return new UnaryNode(NodeType.NOT, new InputNode(input));
            }
          });
          return new BinaryNode(NodeType.AND, inputs);
        });
    } else {
      children = this.rows
        .filter(row => row.output)
        .map(row => {
          const inputs = Object.entries(row.inputs).map(([input, value]) => {
            if (value) {
              return new InputNode(input);
            } else {
              return new UnaryNode(NodeType.NOT, new InputNode(input));
            }
          });
          return new BinaryNode(NodeType.AND, inputs);
        });
    }
    if (children.length === 0) {
      return new Formula(new ConstNode('false'));
    } else if (children.length === 1) {
      if (flipped) return new Formula(new UnaryNode(NodeType.NOT, children[0]));
      else return new Formula(children[0]);
    } else {
      if (flipped) return new Formula(new UnaryNode(NodeType.NOT, new BinaryNode(NodeType.OR, children)));
      else return new Formula(new BinaryNode(NodeType.OR, children));
    }
  }

  public static createTruthTable(formula: Formula): TruthTable {
    const rows = this.generateTable({}, formula.inputs, formula);
    return new TruthTable(rows);
  }

  private static generateTable(fixedInputs: InputMap, dynamicInputs: string[], formula: Formula): TruthTableRow[] {
    if (dynamicInputs.length === 0) {
      return [];
    } else if (dynamicInputs.length === 1) {
      const falseRow: TruthTableRow = {
        inputs: { ...fixedInputs, [dynamicInputs[0]]: false },
        output: false,
      };
      const trueRow: TruthTableRow = {
        inputs: { ...fixedInputs, [dynamicInputs[0]]: true },
        output: false,
      };
      falseRow.output = formula.evaluate(falseRow.inputs);
      trueRow.output = formula.evaluate(trueRow.inputs);
      return [falseRow, trueRow];
    } else {
      const [firstInput, ...remainingInputs] = dynamicInputs;
      const falseRow: TruthTableRow = {
        inputs: { ...fixedInputs, [firstInput]: false },
        output: false,
      };
      const trueRow: TruthTableRow = {
        inputs: { ...fixedInputs, [firstInput]: true },
        output: false,
      };
      return [
        ...this.generateTable(falseRow.inputs, remainingInputs, formula),
        ...this.generateTable(trueRow.inputs, remainingInputs, formula),
      ];
    }
  }
}
