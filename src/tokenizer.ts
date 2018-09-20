import { TokenReader } from "./reader";
import { TokenType } from "./type";
import { Token } from "./token";

export class Tokenizer {
  private tokens: Token[];
  private jsonStr: string;
  private tokenReader: TokenReader;

  constructor() {
    this.tokens = [];
    this.jsonStr = null;
    this.tokenReader = new TokenReader();
  }

  read(jsonStr: string) {
    this.jsonStr = jsonStr;
  }

  tokenize() {
    this.tokenReader.load(this.jsonStr);
    while (true) {
      const token = this.tokenReader.readNextToken();
      this.tokens.push(token);
      if (token.type === TokenType.END_JSON) {
        break;
      }
    }
  }

  getTokens(): Token[] {
    return this.tokens;
  }
}
