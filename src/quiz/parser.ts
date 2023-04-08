import Formula from './formula';
import { BinaryNode, FormulaNode, InputNode, NodeType, UnaryNode } from './formulaNode';

interface LexerToken {
  text: string;
  position: number;
}

interface ParserState {
  operands: FormulaNode[];
  operators: NodeType[];
  expectOperator: boolean;
}

function formulaLexer(text: string): LexerToken[] {
  const tokens: LexerToken[] = [];
  let currentToken: LexerToken | null = null;

  const commitToken = () => {
    if (currentToken !== null) {
      tokens.push(currentToken);
      currentToken = null;
    }
  };

  const newToken = (position: number, content?: string) => {
    currentToken = {
      text: content ?? '',
      position,
    };
  };

  const appendToken = (position: number, content: string) => {
    if (currentToken === null) {
      newToken(position, content);
    } else {
      currentToken.text += content;
    }
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/\s/.test(char)) {
      commitToken();
    } else if (char === '(' || char === ')') {
      commitToken();
      newToken(i, char);
      commitToken();
    } else if (currentToken === null && /[a-zA-Z_]/.test(char)) {
      newToken(i, char);
    } else if (currentToken !== null && /[a-zA-Z0-9_-]/.test(char)) {
      appendToken(i, char);
    } else {
      throw new Error(`Lexer error: unexpected character "${char}" at position ${i}`);
    }
  }
  commitToken();

  return tokens;
}

function formulaParser(tokens: LexerToken[]): Formula {
  if (tokens.length === 0) {
    throw new Error(`Parser error: empty input`);
  }

  const parserStack: ParserState[] = [];

  const addOperand = (position: number, operand: FormulaNode) => {
    const state = parserStack[parserStack.length - 1];
    if (state.expectOperator) {
      throw new Error(`Parser error: expected an operator, but got an operand at position ${position}`);
    }
    if (state.operands.length === state.operators.length + 1) {
      let node = state.operands[state.operands.length - 1];
      while (node.children !== undefined && node.children.length > 0) {
        node = node.children[0];
      }
      if (node.children === undefined) {
        throw new Error(`Parser error: trying to add an operand to a non-operator at position ${position}`);
      }
      node.children.push(operand);
    } else if (state.operands.length === state.operators.length) {
      state.operands.push(operand);
    } else {
      throw new Error(`Parser error: unbalanced operators/operands at position ${position}`);
    }

    if (operand instanceof UnaryNode) {
      state.expectOperator = false;
    } else {
      state.expectOperator = true;
    }
  };

  const addOperator = (position: number, operator: NodeType) => {
    const state = parserStack[parserStack.length - 1];
    if (!state.expectOperator) {
      throw new Error(`Parser error: expected an operand, but got an operator at position ${position}`);
    }
    state.operators.push(operator);
    state.expectOperator = false;
  };

  const pushState = (position: number) => {
    const state = parserStack[parserStack.length - 1];
    if (state !== undefined && state.expectOperator) {
      throw new Error(`Parser error: expected an operator, but got opening parenthesis at position ${position}`);
    }
    parserStack.push({
      operands: [],
      operators: [],
      expectOperator: false,
    });
  };

  const parseState = (position: number, state: ParserState): FormulaNode => {
    if (!state.expectOperator) {
      throw new Error(`Parser error: operand missing at position ${position}`);
    }
    if (state.operands.length !== state.operators.length + 1) {
      throw new Error(`Parser error: unbalanced operators/operands at position ${position}`);
    }
    while (state.operators.length > 0) {
      const maxOperator = state.operators.reduce((acc, curr) => (curr > acc ? curr : acc), -999);
      const maxIdx = state.operators.indexOf(maxOperator);

      const operand1 = state.operands[maxIdx];
      const operand2 = state.operands.splice(maxIdx + 1, 1)[0];
      const operator = state.operators.splice(maxIdx, 1)[0];

      state.operands[maxIdx] = new BinaryNode(operator as NodeType.OR | NodeType.AND, [operand1, operand2]);
    }
    return state.operands[0];
  };

  pushState(0);
  for (const token of tokens) {
    if (token.text === '(') {
      pushState(token.position);
    } else if (token.text === ')') {
      const state = parserStack.pop();
      if (!state) {
        throw new Error(
          `Parser error: stack underflow at position ${token.position} (do you have an extra closing parenthesis?)`
        );
      }
      addOperand(token.position, parseState(token.position, state));
    } else if (token.text.toLowerCase() === 'or') {
      addOperator(token.position, NodeType.OR);
    } else if (token.text.toLowerCase() === 'and') {
      addOperator(token.position, NodeType.AND);
    } else if (token.text.toLowerCase() === 'not') {
      addOperand(token.position, new UnaryNode(NodeType.NOT, undefined));
    } else if (/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(token.text)) {
      addOperand(token.position, new InputNode(token.text));
    } else {
      throw new Error(`Parser error: unknown token "${token.text}" at position ${token.position}`);
    }
  }
  const finalPosition = tokens[tokens.length - 1].position;
  if (parserStack.length !== 1) {
    throw new Error(`Parser error: parenthesis mismatch at position ${finalPosition}`);
  }
  return new Formula(parseState(finalPosition, parserStack[0]));
}

export function parseFormula(text: string): Formula {
  return formulaParser(formulaLexer(text));
}
