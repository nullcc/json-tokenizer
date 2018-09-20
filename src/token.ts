import { TokenType } from "./type";

export class Token {
  public type: TokenType;
  public value: any;

  constructor(type: TokenType, value: any) {
    this.type = type;
    this.value = value;
  }
}
