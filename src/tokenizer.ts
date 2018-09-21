import { TokenReader } from "./reader";
import { Token } from "./token";
import { TokenType } from "./type";

export class Tokenizer {
  private tokens: Token[];
  private jsonStr: string;
  private tokenReader: TokenReader;

  constructor() {
    this.tokens = [];
    this.jsonStr = null;
    this.tokenReader = new TokenReader();
  }

  public read(jsonStr: string) {
    this.jsonStr = jsonStr;
  }

  public tokenize() {
    this.tokenReader.load(this.jsonStr);

    while (true) {
      const token = this.tokenReader.readNextToken();
      this.tokens.push(token);
      if (token.type === TokenType.END_JSON) {
        break;
      }
    }
  }

  public getTokens(): Token[] {
    return this.tokens;
  }
}
