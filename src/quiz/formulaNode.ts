/* eslint-disable max-classes-per-file */
export interface InputMap {
  [key: string]: boolean;
}

export const enum NodeType {
  OR,
  AND,
  NOT,
  INPUT,
  CONST,
}

export abstract class FormulaNodeBase {
  public abstract type: NodeType;

  public abstract value?: string;

  public abstract children?: FormulaNode[];

  public abstract evaluate(inputs: InputMap): boolean;
  public abstract toString(): string;
  public abstract toLatex(): string;
  public abstract clone(): FormulaNode;
}

export class ConstNode extends FormulaNodeBase {
  public override type = NodeType.CONST as const;

  public override value: 'true' | 'false';

  public override children = undefined;

  public constructor(value: 'true' | 'false') {
    super();
    this.value = value;
  }

  public override evaluate(_inputs: InputMap): boolean {
    return this.value === 'true';
  }

  public override toString(): string {
    return this.value;
  }

  public override toLatex(): string {
    return this.value;
  }

  public override clone(): ConstNode {
    return new ConstNode(this.value);
  }
}

export class InputNode extends FormulaNodeBase {
  public override type = NodeType.INPUT as const;

  public override value: string;

  public override children = undefined;

  public constructor(value: string) {
    super();
    this.value = value;
  }

  public override evaluate(inputs: InputMap): boolean {
    const val = inputs[this.value];
    if (val === undefined) {
      throw new Error(`Missing value for input ${this.value}`);
    }
    return val;
  }

  public override toString(): string {
    return this.value;
  }

  public override toLatex(): string {
    return this.value;
  }

  public override clone(): InputNode {
    return new InputNode(this.value);
  }
}

export class BinaryNode extends FormulaNodeBase {
  public override type: NodeType.AND | NodeType.OR;

  public override value: undefined;

  public override children;

  public constructor(type: BinaryNode['type'], children: FormulaNode[]) {
    super();
    this.type = type;
    this.children = children;
  }

  public override evaluate(inputs: InputMap): boolean {
    if (this.type === NodeType.AND) {
      for (const child of this.children) {
        if (!child.evaluate(inputs)) {
          return false;
        }
      }
      return true;
    } else if (this.type === NodeType.OR) {
      for (const child of this.children) {
        if (child.evaluate(inputs)) {
          return true;
        }
      }
      return false;
    } else {
      throw new Error(`Unknown node type ${this.type}`);
    }
  }

  public override toString(): string {
    const childrenStrings = this.children.map(child => {
      if (child.type < this.type) {
        return `(${child.toString()})`;
      } else {
        return child.toString();
      }
    });
    if (this.type === NodeType.AND) {
      return childrenStrings.join(' and ');
    } else if (this.type === NodeType.OR) {
      return childrenStrings.join(' or ');
    } else {
      throw new Error(`Unknown node type ${this.type}`);
    }
  }

  public override toLatex(): string {
    const childrenStrings = this.children.map(child => {
      if (child.type < this.type) {
        return `(${child.toLatex()})`;
      } else {
        return child.toLatex();
      }
    });
    if (this.type === NodeType.AND) {
      return childrenStrings.join(' \\bullet ');
    } else if (this.type === NodeType.OR) {
      return childrenStrings.join(' + ');
    } else {
      throw new Error(`Unknown node type ${this.type}`);
    }
  }

  public override clone(): BinaryNode {
    return new BinaryNode(
      this.type,
      this.children.map(child => child.clone())
    );
  }
}

export class UnaryNode extends FormulaNodeBase {
  public override type: NodeType.NOT;

  public override value: undefined;

  public override children;

  public constructor(type: UnaryNode['type'], child: FormulaNode | undefined) {
    super();
    this.type = type;
    this.children = child === undefined ? [] : [child];
  }

  public override evaluate(inputs: InputMap): boolean {
    if (this.type === NodeType.NOT) {
      if (this.children.length !== 1) {
        throw new Error(`Expects exactly 1 child in a NOT node, but got ${this.children.length}`);
      }
      return !this.children[0].evaluate(inputs);
    } else {
      throw new Error(`Unknown node type ${this.type}`);
    }
  }

  public override toString(): string {
    if (this.type === NodeType.NOT) {
      if (this.children.length !== 1) {
        throw new Error(`Expects exactly 1 child in a NOT node, but got ${this.children.length}`);
      }
      if (this.children[0].type < this.type) {
        return `not (${this.children[0].toString()})`;
      } else {
        return `not ${this.children[0].toString()}`;
      }
    } else {
      throw new Error(`Unknown node type ${this.type}`);
    }
  }

  public override toLatex(): string {
    if (this.type === NodeType.NOT) {
      if (this.children.length !== 1) {
        throw new Error(`Expects exactly 1 child in a NOT node, but got ${this.children.length}`);
      }
      return `\\overline{${this.children[0].toLatex()}}`;
    } else {
      throw new Error(`Unknown node type ${this.type}`);
    }
  }

  public override clone(): UnaryNode {
    return new UnaryNode(this.type, this.children[0].clone());
  }
}

export type FormulaNode = ConstNode | InputNode | BinaryNode | UnaryNode;
