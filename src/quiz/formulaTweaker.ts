import Formula from './formula';
import { BinaryNode, FormulaNode, NodeType, UnaryNode } from './formulaNode';

// function flipAndOrTweak(node: FormulaNode): FormulaNode {
//   if (node.type === NodeType.OR) {
//     node.type = NodeType.AND;
//   } else if (node.type === NodeType.AND) {
//     node.type = NodeType.OR;
//   }

//   if (node.children) {
//     for (let i = 0; i < node.children.length; i++) {
//       node.children[i] = flipAndOrTweak(node.children[i]);
//     }
//   }

//   return node;
// }

function toggleNot(node: FormulaNode, parent: BinaryNode | UnaryNode) {
  const idx = parent.children.indexOf(node);
  if (node.type === NodeType.NOT) {
    parent.children[idx] = node.children[0];
  } else {
    parent.children[idx] = new UnaryNode(NodeType.NOT, node);
  }
}

interface NodeEntry {
  node: FormulaNode;
  parent: BinaryNode | UnaryNode;
}

function listNodes(node: FormulaNode): NodeEntry[] {
  if (!node.children || node.children.length === 0) return [];
  if (node.type === NodeType.NOT) {
    return node.children.flatMap(child => listNodes(child));
  } else {
    return node.children.flatMap(child => [{ node: child, parent: node }, ...listNodes(child)]);
  }
}

function randomToggleNotTweak(node: FormulaNode): FormulaNode {
  const nodes = listNodes(node);
  const chosen = nodes[Math.floor(Math.random() * nodes.length)];
  toggleNot(chosen.node, chosen.parent); // todo: random undefined 'chosen'
  return node;
}

// function randomFlipAndOrTweak(node: FormulaNode): FormulaNode {
//   const nodes = listNodes(node).filter(n => n.node instanceof BinaryNode);
//   const idx = Math.floor(Math.random() * nodes.length);
//   nodes[idx].node.type = nodes[idx].node.type === NodeType.AND ? NodeType.OR : NodeType.AND;
//   return node;
// }

const TWEAKS = [randomToggleNotTweak];

export default function tweakFormula(formula: Formula): Formula {
  const idx = Math.floor(Math.random() * TWEAKS.length);
  const tweak = TWEAKS[idx];
  return new Formula(tweak(formula.clone().node));
}
