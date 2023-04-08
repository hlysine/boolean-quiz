import { FormulaNode, InputMap, NodeType } from './formulaNode';

export default class Formula {
  public node: FormulaNode;

  public inputs: string[];

  public constructor(node: FormulaNode) {
    this.node = node;
    this.inputs = Formula.getInputs(node);
  }

  public evaluate(inputs: InputMap): boolean {
    return this.node.evaluate(inputs);
  }

  public clone(): Formula {
    return new Formula(this.node.clone());
  }

  private static getInputs(node: FormulaNode): string[] {
    if (node.type === NodeType.INPUT) {
      return [node.value];
    } else {
      return [...new Set(node.children.flatMap(child => this.getInputs(child)))];
    }
  }
}
