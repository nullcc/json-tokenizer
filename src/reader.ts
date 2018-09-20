import { Token } from "./token";
import { TokenType } from "./type";

const EOF = 'EOF';

export class TokenReader {
  private data: string;
  public startIndex: number;
  public currentIndex: number;

  constructor() {
    this.data = null;
    this.startIndex = 0;
    this.currentIndex = 0;
  }

  /**
   * Load JSON string to token reader.
   * @param data JSON string
   */
  load(data: string) {
    this.data = data;
  }
  
  /**
   * Expect next character to be a specific value. 
   * Skip this character if condition is satisfied, or else throw error.
   * @param c 
   */
  expect(c) {
    if (c && this.data[this.currentIndex] !== c) {
      throw new Error("Invalid JSON input.");
    } else {
      this.currentIndex++;
    }
  }

  /**
   * Return true if c is a space string literal, or else return false.
   * @param c
   */
  isSpace(c): boolean {
    return /\s/.test(c);
  }

  /**
   * Return true if c is a 'null' string literal, or else return false.
   * @param c 
   */
  isNull(c): boolean {
    if (c === "n") {
      this.expect("u");
      this.expect("l");
      this.expect("l");
      return true;
    }
    return false;
  }

  /**
   * Return true if c is a 'true' string literal, or else return false.
   * @param c 
   */
  isTrue(c): boolean {
    if (c === "t") {
      this.expect("r");
      this.expect("u");
      this.expect("e");
      return true;
    }
    return false;
  }

  /**
   * Return true if c is a 'false' string literal, or else return false.
   * @param c 
   */
  isFalse(c): boolean {
    if (c === "f") {
      this.expect("a");
      this.expect("l");
      this.expect("s");
      this.expect("e");
      return true;
    }
    return false;
  }

  /**
   * Return true if c is a number string literal, or else return false.
   * @param c 
   */
  isNum(c): boolean {
    return /[0-9]/.test(c) || c === "-";
  }

  /**
   * Return true if c is a hex(0-9A-Fa-f) string literal, or else return false.
   * @param c 
   */
  isHex(c): boolean {
    return /[0-9A-Fa-f]/.test(c);
  }

  /**
   * Return true if c is a escape value string literal, or else return false.
   * @param c 
   */
  isEscape(c): boolean {
    if (c === "\\") {
      c = this.readForward();
      if (
        c === '"' ||
        c === "\\" ||
        c === "/" ||
        c === "b" ||
        c === "f" ||
        c === "n" ||
        c === "t" ||
        c === "r" ||
        c === "u"
      ) {
        return true;
      } else {
        throw new Error("Invalid JSON input.");
      }
    } else {
      return false;
    }
  }

  /**
   * Return true if c is a 1-9 string literal, or else return false.
   * @param c 
   */
  isDigitOne2Nine(c): boolean {
    return /[1-9]/.test(c);
  }

  /**
   * Return true if c is a 0-9 string literal, or else return false.
   * @param c 
   */
  isDigit(c): boolean {
    return /[0-9]/.test(c);
  }

  /**
   * Return true if c is a 'e' or 'E' string literal, or else return false.
   * @param c 
   */
  isExp(c): boolean {
    return c === "e" || c === "E";
  }

  /**
   * Read next character. Return 'EOF' if this.currentIndex is out of range of this.data.
   */
  readForward(): string {
    if (this.currentIndex < this.data.length) {
      const c = this.data[this.currentIndex];
      this.currentIndex += 1;
      return c;
    }
    return EOF;
  }

  /**
   * Back forward a character.
   */
  readBackward() {
    this.currentIndex -= 1;
  }

  /**
   * Try to read a string.
   */
  readString() {
    let str = "";
    while (true) {
      let c = this.readForward();
      if (this.isEscape(c)) {
        if (c === "u") { // unicode is consist of 4 hex characters and starts with \u
          str += `\\${c}`;
          for (let i = 0; i < 4; i += 1) {
            c = this.readForward();
            if (this.isHex(c)) {
              str += `${c}`;
            } else {
              throw new Error("Invalid Json input.");
            }
          }
        } else {
          str += `\\${c}`;
        }
      } else if (c === '"') { // end of string, return a token
        return new Token(TokenType.STRING, str);
      } else { // collect character
        str += `${c}`;
      }
    }
  }

  /**
   * Try to read a number.
   */
  readNumber() {
    let str = "";
    let c = this.readForward();
    if (c === "-") { // may be a negative number
      str += `${c}`;
      c = this.readForward();
      if (c === "0") { // -0
        str += `${c}`;
        str = this.appendNumber(str);
      } else if (this.isDigitOne2Nine(c)) { // -1 ~ -9
        do { // keep reading characters while character is a digit
          str += `${c}`;
          c = this.readForward();
        } while (this.isDigit(c));
        // read backward once because of reading an not number extra character in do...while block
        this.readBackward();
        str = this.appendNumber(str);
      } else {
        throw new Error("Invalid JSON input: - is not followed by a digit.");
      }
    } else if (c === "0") { // 0
      str += `${c}`;
      str = this.appendNumber(str);
    } else if (this.isDigitOne2Nine(c)) { // 1-9
      do {
        str += `${c}`;
        c = this.readForward();
      } while (this.isDigit(c));
      this.readBackward();
      str = this.appendNumber(str);
    }
    let num = 0;
    if (str.indexOf(".") !== -1) {
      num = parseFloat(str);
    } else {
      num = parseInt(str);
    }
    return new Token(TokenType.NUMBER, num);
  }

  appendNumber(str) {
    let c = this.readForward();
    if (c === ".") {
      str += `${c}`;
      str = this.appendDecimalPart(str);
      c = this.readForward();
      if (this.isExp(c)) {
        str = this.appendExp(str);
      } else {
        this.readBackward();
      }
    } else if (this.isExp(c)) {
      str = this.appendExp(str);
    } else {
      this.readBackward();
    }
    return str;
  }

  /**
   * Append decimal part to str.
   * @param str
   */
  appendDecimalPart(str) {
    let c = this.readForward();
    do {
      str += `${c}`;
      c = this.readForward();
    } while (this.isDigit(c));
    this.readBackward();
    return str;
  }

  appendExp(str) {
    let c = this.readForward();
    let op = c;
    if (op !== "+" && op !== "-") {
      throw new Error("Invalid JSON input.");
    }
    let pow: any = "";
    c = this.readForward();
    do {
      pow += `${c}`;
      c = this.readForward();
    } while (this.isDigit(c));
    this.readBackward();
    if (op === "-") {
      pow = -pow;
    }
    let num = parseFloat(str) * Math.pow(10, parseInt(pow));
    return num.toString();
  }

  readNextToken() {
    let c: any = "";
    do { // skip spaces if doesn't meet a valid token
      c = this.readForward();
    } while (this.isSpace(c));

    if (this.isNull(c)) { // 'null'
      return new Token(TokenType.NULL, null);
    } else if (this.isTrue(c)) { // 'true'
      return new Token(TokenType.BOOLEAN, true);
    } else if (this.isFalse(c)) { // f'alse'
      return new Token(TokenType.BOOLEAN, false);
    } else if (c === ",") { // ','
      return new Token(TokenType.COMMA, ",");
    } else if (c === ":") { // ':'
      return new Token(TokenType.COLON, ":");
    } else if (c === "{") { // '{'
      return new Token(TokenType.BEGIN_OBJECT, "{");
    } else if (c === "}") { // '}'
      return new Token(TokenType.END_OBJECT, "}");
    } else if (c === "[") { // '['
      return new Token(TokenType.BEGIN_ARRAY, "[");
    } else if (c === "]") { // ']'
      return new Token(TokenType.END_ARRAY, "]");
    } else if (c === '"') { // try to read a string if meet a '"'
      return this.readString();
    } else if (this.isNum(c)) { // try to read a number (integer, float, exponential) if meet a number string literal
      this.readBackward();
      return this.readNumber();
    } else if (c === EOF) { // end of JSON if meet 'EOF'
      return new Token(TokenType.END_JSON, "EOF");
    } else {
      throw new Error("Invalid JSON input.");
    }
  }
}
