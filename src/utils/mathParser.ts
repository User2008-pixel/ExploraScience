/**
 * Safe, robust mathematical expression tokenizer and recursive descent parser.
 * Supports:
 * - Basic operators: +, -, *, /, ^ (exponentiation), % (modulus)
 * - Implicit multiplication: 2x, 3sin(x), (x+1)(x-2)
 * - Functions: sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, sqrt, cbrt, abs, mod, log, ln, exp, floor, ceil, round
 * - Modulus: mod(x), mod(a, b), |x|, |x - 2|, x mod y
 * - Calculus support: numerical differentiation df/dx and numerical integration ∫_a^b f(x) dx
 * - Constants: pi, e
 * - Variables: x, t, a, b, c, k
 */

export interface MathContext {
  x?: number;
  t?: number;
  a?: number;
  b?: number;
  c?: number;
  k?: number;
  isRadians?: boolean;
}

type TokenType = 'NUMBER' | 'IDENT' | 'OP' | 'LPAREN' | 'RPAREN' | 'COMMA';

interface Token {
  type: TokenType;
  value: string;
}

/**
 * Preprocesses mathematical strings to normalize common student notation:
 * - Converts vertical bar modulus |x| into abs(x)
 * - Converts unicode symbols like π, √, ÷, ×, −
 */
export function preprocessExpression(raw: string): string {
  if (!raw) return '';
  let s = raw
    .replace(/π/g, 'pi')
    .replace(/÷/g, '/')
    .replace(/[×•]/g, '*')
    .replace(/−/g, '-')
    .replace(/√\s*\(([^)]+)\)/g, 'sqrt($1)')
    .replace(/√\s*([a-zA-Z0-9.]+)/g, 'sqrt($1)');

  // Convert |...| to abs(...)
  // Scan for vertical bars and pair them intelligently
  let result = '';
  let insideBar = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '|') {
      // Determine if opening or closing
      // If previous non-space char is an operator or open paren or start of string -> opening
      const prev = result.trimEnd().slice(-1);
      const isOpening = !insideBar && (!prev || /[+\-*/^%,(=]/.test(prev));
      if (isOpening) {
        result += 'abs(';
        insideBar = true;
      } else {
        result += ')';
        insideBar = false;
      }
    } else {
      result += ch;
    }
  }
  if (insideBar) {
    result += ')'; // close unclosed bar
  }

  return result;
}

export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  const s = preprocessExpression(expr).trim();
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/\d/.test(ch) || (ch === '.' && i + 1 < s.length && /\d/.test(s[i + 1]))) {
      let numStr = '';
      while (i < s.length && (/[\d.]/.test(s[i]) || (s[i].toLowerCase() === 'e' && i + 1 < s.length && /[\d+-]/.test(s[i + 1])))) {
        numStr += s[i];
        if (s[i].toLowerCase() === 'e') {
          i++;
          if (i < s.length && (s[i] === '+' || s[i] === '-')) {
            numStr += s[i];
            i++;
          }
          continue;
        }
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let ident = '';
      while (i < s.length && /[a-zA-Z0-9_]/.test(s[i])) {
        ident += s[i];
        i++;
      }
      const lower = ident.toLowerCase();

      // If identifier is 'mod' and followed by whitespace/expression rather than '(', treat as '%' operator
      if (lower === 'mod') {
        // Peek ahead to see if opening paren
        let k = i;
        while (k < s.length && /\s/.test(s[k])) k++;
        if (s[k] !== '(') {
          tokens.push({ type: 'OP', value: '%' });
          continue;
        }
      }

      tokens.push({ type: 'IDENT', value: lower });
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (ch === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    if (/[+\-*/^%]/.test(ch)) {
      tokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }

    // skip unrecognized char
    i++;
  }

  // Insert implicit multiplications:
  // e.g. NUMBER IDENT -> NUMBER * IDENT (2x -> 2 * x)
  // NUMBER LPAREN -> NUMBER * LPAREN (2(x) -> 2 * (x))
  // RPAREN LPAREN -> RPAREN * LPAREN ((x)(y) -> (x) * (y))
  // RPAREN IDENT -> RPAREN * IDENT ((x)y -> (x) * y)
  // IDENT IDENT (if not function name) e.g. x y -> x * y
  const expanded: Token[] = [];
  for (let j = 0; j < tokens.length; j++) {
    const curr = tokens[j];
    expanded.push(curr);

    if (j + 1 < tokens.length) {
      const next = tokens[j + 1];
      const needsMult =
        (curr.type === 'NUMBER' && (next.type === 'IDENT' || next.type === 'LPAREN')) ||
        (curr.type === 'RPAREN' && (next.type === 'LPAREN' || next.type === 'NUMBER' || next.type === 'IDENT')) ||
        (curr.type === 'IDENT' && !isKnownFunction(curr.value) && (next.type === 'IDENT' || next.type === 'LPAREN' || next.type === 'NUMBER'));

      if (needsMult) {
        expanded.push({ type: 'OP', value: '*' });
      }
    }
  }

  return expanded;
}

function isKnownFunction(name: string): boolean {
  const fns = [
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
    'sinh', 'cosh', 'tanh', 'sqrt', 'cbrt', 'abs', 'mod',
    'log', 'ln', 'exp', 'floor', 'ceil', 'round'
  ];
  return fns.includes(name.toLowerCase());
}

export class ExpressionParser {
  private tokens: Token[] = [];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private next(): Token {
    return this.tokens[this.pos++];
  }

  public parse(context: MathContext = {}): number {
    this.pos = 0;
    const res = this.parseExpression(context);
    return res;
  }

  // expr = term { ("+" | "-") term }
  private parseExpression(context: MathContext): number {
    let result = this.parseTerm(context);

    while (this.peek() && this.peek()!.type === 'OP' && (this.peek()!.value === '+' || this.peek()!.value === '-')) {
      const op = this.next().value;
      const right = this.parseTerm(context);
      if (op === '+') result += right;
      else result -= right;
    }

    return result;
  }

  // term = factor { ("*" | "/" | "%") factor }
  private parseTerm(context: MathContext): number {
    let result = this.parsePower(context);

    while (this.peek() && this.peek()!.type === 'OP' && (this.peek()!.value === '*' || this.peek()!.value === '/' || this.peek()!.value === '%')) {
      const op = this.next().value;
      const right = this.parsePower(context);
      if (op === '*') result *= right;
      else if (op === '/') {
        if (Math.abs(right) < 1e-15) return NaN;
        result /= right;
      } else {
        result %= right;
      }
    }

    return result;
  }

  // power = unary { "^" unary } (right associative)
  private parsePower(context: MathContext): number {
    const left = this.parseUnary(context);

    if (this.peek() && this.peek()!.type === 'OP' && this.peek()!.value === '^') {
      this.next(); // consume ^
      const right = this.parsePower(context);
      return Math.pow(left, right);
    }

    return left;
  }

  // unary = ("+" | "-") unary | primary
  private parseUnary(context: MathContext): number {
    if (this.peek() && this.peek()!.type === 'OP') {
      const op = this.peek()!.value;
      if (op === '+' || op === '-') {
        this.next();
        const val = this.parseUnary(context);
        return op === '-' ? -val : val;
      }
    }
    return this.parsePrimary(context);
  }

  // primary = NUMBER | IDENT [ "(" ... ")" ] | LPAREN expr RPAREN
  private parsePrimary(context: MathContext): number {
    const tok = this.peek();
    if (!tok) return NaN;

    if (tok.type === 'NUMBER') {
      this.next();
      return parseFloat(tok.value);
    }

    if (tok.type === 'LPAREN') {
      this.next(); // consume (
      const val = this.parseExpression(context);
      if (this.peek() && this.peek()!.type === 'RPAREN') {
        this.next(); // consume )
      }
      return val;
    }

    if (tok.type === 'IDENT') {
      const name = this.next().value;
      const isRad = context.isRadians !== false; // default radians

      // Check if it's a function call e.g. sin(x), mod(x, 2)
      if (this.peek() && this.peek()!.type === 'LPAREN') {
        this.next(); // consume (
        const arg = this.parseExpression(context);
        let arg2: number | undefined = undefined;
        if (this.peek() && this.peek()!.type === 'COMMA') {
          this.next(); // consume ,
          arg2 = this.parseExpression(context);
        }
        if (this.peek() && this.peek()!.type === 'RPAREN') {
          this.next(); // consume )
        }

        switch (name) {
          case 'mod': {
            if (arg2 !== undefined) {
              if (Math.abs(arg2) < 1e-15) return NaN;
              return ((arg % arg2) + arg2) % arg2;
            }
            return Math.abs(arg);
          }
          case 'sin':
            return Math.sin(isRad ? arg : (arg * Math.PI) / 180);
          case 'cos':
            return Math.cos(isRad ? arg : (arg * Math.PI) / 180);
          case 'tan': {
            const radVal = isRad ? arg : (arg * Math.PI) / 180;
            // check asymptote near pi/2 + k*pi
            if (Math.abs(Math.cos(radVal)) < 1e-10) return NaN;
            return Math.tan(radVal);
          }
          case 'asin': {
            const res = Math.asin(arg);
            return isRad ? res : (res * 180) / Math.PI;
          }
          case 'acos': {
            const res = Math.acos(arg);
            return isRad ? res : (res * 180) / Math.PI;
          }
          case 'atan': {
            const res = Math.atan(arg);
            return isRad ? res : (res * 180) / Math.PI;
          }
          case 'sinh':
            return Math.sinh(arg);
          case 'cosh':
            return Math.cosh(arg);
          case 'tanh':
            return Math.tanh(arg);
          case 'sqrt':
            return arg < 0 ? NaN : Math.sqrt(arg);
          case 'cbrt':
            return Math.cbrt(arg);
          case 'abs':
            return Math.abs(arg);
          case 'log':
            return arg <= 0 ? NaN : Math.log10(arg);
          case 'ln':
            return arg <= 0 ? NaN : Math.log(arg);
          case 'exp':
            return Math.exp(arg);
          case 'floor':
            return Math.floor(arg);
          case 'ceil':
            return Math.ceil(arg);
          case 'round':
            return Math.round(arg);
          default:
            return NaN;
        }
      }

      // Check constants
      if (name === 'pi' || name === 'π') return Math.PI;
      if (name === 'e') return Math.E;

      // Check variables from context
      if (name === 'x') return context.x ?? NaN;
      if (name === 't') return context.t ?? NaN;
      if (name === 'a') return context.a ?? 1;
      if (name === 'b') return context.b ?? 1;
      if (name === 'c') return context.c ?? 1;
      if (name === 'k') return context.k ?? 1;

      return NaN;
    }

    return NaN;
  }
}

/**
 * Precompiles an expression into an evaluable function for high-performance canvas plotting.
 */
export function compileExpression(exprStr: string): (ctx: MathContext) => number {
  if (!exprStr.trim()) return () => NaN;
  try {
    const tokens = tokenize(exprStr);
    const parser = new ExpressionParser(tokens);
    return (ctx: MathContext) => {
      try {
        return parser.parse(ctx);
      } catch {
        return NaN;
      }
    };
  } catch {
    return () => NaN;
  }
}

/**
 * Computes numerical derivative df/dx using central difference:
 * f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
 */
export function computeDerivative(
  fn: (ctx: MathContext) => number,
  x: number,
  ctx: MathContext = {},
  h: number = 0.0001
): number {
  const yPlus = fn({ ...ctx, x: x + h });
  const yMinus = fn({ ...ctx, x: x - h });
  if (isNaN(yPlus) || isNaN(yMinus)) return NaN;
  return (yPlus - yMinus) / (2 * h);
}

/**
 * Computes numerical definite integral ∫_a^b f(x) dx using Simpson's 1/3 Rule.
 * Accurate, robust, and fast for plotting shaded areas under curves.
 */
export function computeIntegral(
  fn: (ctx: MathContext) => number,
  a: number,
  b: number,
  ctx: MathContext = {},
  n: number = 100
): number {
  if (isNaN(a) || isNaN(b)) return NaN;
  if (a === b) return 0;
  const isReversed = a > b;
  const lower = isReversed ? b : a;
  const upper = isReversed ? a : b;

  const actualN = n % 2 === 0 ? n : n + 1;
  const h = (upper - lower) / actualN;
  let y0 = fn({ ...ctx, x: lower });
  let yn = fn({ ...ctx, x: upper });
  if (isNaN(y0) || !isFinite(y0)) y0 = 0;
  if (isNaN(yn) || !isFinite(yn)) yn = 0;

  let sum = y0 + yn;
  for (let i = 1; i < actualN; i++) {
    const xi = lower + i * h;
    let yi = fn({ ...ctx, x: xi });
    if (isNaN(yi) || !isFinite(yi)) yi = 0;
    sum += (i % 2 === 0 ? 2 : 4) * yi;
  }

  const val = (h / 3) * sum;
  return isReversed ? -val : val;
}

export interface MathSymbolItem {
  label: string;
  insert: string;
  description: string;
  category: 'calculus' | 'algebra' | 'greek' | 'constant';
}

export const MATH_SYMBOLS: MathSymbolItem[] = [
  { label: 'mod', insert: 'mod(', description: 'Modulus / Remainder function: mod(x, y) or |x|', category: 'algebra' },
  { label: '|x|', insert: '|x|', description: 'Absolute Value / Modulus magnitude', category: 'algebra' },
  { label: '∫', insert: '∫', description: 'Definite Integral: area under curve', category: 'calculus' },
  { label: 'd/dx', insert: 'd/dx', description: 'Derivative: instantaneous rate of change / slope', category: 'calculus' },
  { label: '√x', insert: 'sqrt(', description: 'Square root', category: 'algebra' },
  { label: 'xʸ', insert: '^', description: 'Exponent / Power', category: 'algebra' },
  { label: 'π', insert: 'pi', description: 'Pi ratio (3.14159...)', category: 'constant' },
  { label: 'e', insert: 'e', description: "Euler's constant (2.71828...)", category: 'constant' },
  { label: 'sin', insert: 'sin(', description: 'Sine function', category: 'algebra' },
  { label: 'cos', insert: 'cos(', description: 'Cosine function', category: 'algebra' },
  { label: 'tan', insert: 'tan(', description: 'Tangent function', category: 'algebra' },
  { label: 'ln', insert: 'ln(', description: 'Natural logarithm (base e)', category: 'algebra' },
  { label: 'log', insert: 'log(', description: 'Common logarithm (base 10)', category: 'algebra' },
  { label: 'Δ', insert: 'Δ', description: 'Delta / difference', category: 'greek' },
  { label: 'θ', insert: 'θ', description: 'Theta angle', category: 'greek' },
  { label: 'λ', insert: 'λ', description: 'Wavelength', category: 'greek' },
  { label: 'Σ', insert: 'Σ', description: 'Summation', category: 'calculus' },
  { label: '∞', insert: '∞', description: 'Infinity', category: 'constant' },
];

/**
 * Performs linear regression on experimental data points (x_i, y_i).
 * Returns slope m, intercept c, and R^2 correlation coefficient.
 */
export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  correlationCoeff: number;
  equationStr: string;
  n: number;
  xMean: number;
  yMean: number;
}

export function calculateLinearRegression(points: { x: number; y: number }[]): RegressionResult | null {
  const n = points.length;
  if (n < 2) return null;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (const pt of points) {
    sumX += pt.x;
    sumY += pt.y;
    sumXY += pt.x * pt.y;
    sumX2 += pt.x * pt.x;
    sumY2 += pt.y * pt.y;
  }

  const denomM = n * sumX2 - sumX * sumX;
  if (Math.abs(denomM) < 1e-12) return null;

  const slope = (n * sumXY - sumX * sumY) / denomM;
  const intercept = (sumY - slope * sumX) / n;

  // Correlation coefficient r
  const denomR = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const r = denomR !== 0 ? (n * sumXY - sumX * sumY) / denomR : 0;
  const rSquared = r * r;

  const sign = intercept >= 0 ? '+' : '−';
  const absIntercept = Math.abs(intercept).toFixed(3);
  const equationStr = `y = ${slope.toFixed(3)}x ${sign} ${absIntercept}`;

  return {
    slope,
    intercept,
    rSquared,
    correlationCoeff: r,
    equationStr,
    n,
    xMean: sumX / n,
    yMean: sumY / n,
  };
}

/**
 * Standard STEM Physical Science Constants
 */
export interface PhysicalConstant {
  symbol: string;
  name: string;
  value: number;
  displayValue: string;
  unit: string;
  latex: string;
  category: 'physics' | 'chemistry' | 'universal';
}

export const PHYSICAL_CONSTANTS: PhysicalConstant[] = [
  {
    symbol: 'c',
    name: 'Speed of Light in Vacuum',
    value: 299792458,
    displayValue: '2.998 × 10⁸',
    unit: 'm/s',
    latex: 'c = 3.00 \\times 10^8\\,\\text{m/s}',
    category: 'physics',
  },
  {
    symbol: 'g',
    name: 'Standard Earth Gravity',
    value: 9.80665,
    displayValue: '9.807',
    unit: 'm/s²',
    latex: 'g = 9.81\\,\\text{m/s}^2',
    category: 'physics',
  },
  {
    symbol: 'G',
    name: 'Universal Gravitational Constant',
    value: 6.6743e-11,
    displayValue: '6.674 × 10⁻¹¹',
    unit: 'N·m²/kg²',
    latex: 'G = 6.674 \\times 10^{-11}\\,\\text{N}\\cdot\\text{m}^2/\\text{kg}^2',
    category: 'physics',
  },
  {
    symbol: 'h',
    name: "Planck's Constant",
    value: 6.62607e-34,
    displayValue: '6.626 × 10⁻³⁴',
    unit: 'J·s',
    latex: 'h = 6.626 \\times 10^{-34}\\,\\text{J}\\cdot\\text{s}',
    category: 'physics',
  },
  {
    symbol: 'e',
    name: 'Elementary Electric Charge',
    value: 1.6021766e-19,
    displayValue: '1.602 × 10⁻¹⁹',
    unit: 'C',
    latex: 'e = 1.602 \\times 10^{-19}\\,\\text{C}',
    category: 'physics',
  },
  {
    symbol: 'N_A',
    name: "Avogadro's Constant",
    value: 6.02214076e23,
    displayValue: '6.022 × 10²³',
    unit: 'mol⁻¹',
    latex: 'N_A = 6.022 \\times 10^{23}\\,\\text{mol}^{-1}',
    category: 'chemistry',
  },
  {
    symbol: 'R',
    name: 'Universal Ideal Gas Constant',
    value: 8.3144626,
    displayValue: '8.314',
    unit: 'J/(mol·K)',
    latex: 'R = 8.314\\,\\text{J}/(\\text{mol}\\cdot\\text{K})',
    category: 'chemistry',
  },
  {
    symbol: 'k_B',
    name: "Boltzmann's Constant",
    value: 1.380649e-23,
    displayValue: '1.381 × 10⁻²³',
    unit: 'J/K',
    latex: 'k_B = 1.381 \\times 10^{-23}\\,\\text{J}/\\text{K}',
    category: 'universal',
  },
  {
    symbol: 'ε_0',
    name: 'Permittivity of Free Space',
    value: 8.8541878e-12,
    displayValue: '8.854 × 10⁻¹²',
    unit: 'F/m',
    latex: '\\varepsilon_0 = 8.854 \\times 10^{-12}\\,\\text{F}/\\text{m}',
    category: 'physics',
  },
  {
    symbol: 'm_e',
    name: 'Electron Rest Mass',
    value: 9.1093837e-31,
    displayValue: '9.109 × 10⁻³¹',
    unit: 'kg',
    latex: 'm_e = 9.109 \\times 10^{-31}\\,\\text{kg}',
    category: 'physics',
  },
];
