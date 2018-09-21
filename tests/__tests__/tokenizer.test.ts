import { Tokenizer, TokenType } from "../../src";

describe("Test Tokenizer", () => {
  test("Test 'true'", async () => {
    const jsonStr = "true";
    const tokenizer = new Tokenizer();
    tokenizer.read(jsonStr);
    tokenizer.tokenize();
    const tokens = tokenizer.getTokens();
    expect(tokens.length).toEqual(2);
    expect(tokens[0].type).toEqual(TokenType.BOOLEAN);
    expect(tokens[0].value).toEqual(true);
    expect(tokens[1].type).toEqual(TokenType.END_JSON);
    expect(tokens[1].value).toEqual("EOF");
  });

  test("Test 'false'", async () => {
    const jsonStr = "false";
    const tokenizer = new Tokenizer();
    tokenizer.read(jsonStr);
    tokenizer.tokenize();
    const tokens = tokenizer.getTokens();
    expect(tokens.length).toEqual(2);
    expect(tokens[0].type).toEqual(TokenType.BOOLEAN);
    expect(tokens[0].value).toEqual(false);
    expect(tokens[1].type).toEqual(TokenType.END_JSON);
    expect(tokens[1].value).toEqual("EOF");
  });

  test("Test 'null'", async () => {
    const jsonStr = "null";
    const tokenizer = new Tokenizer();
    tokenizer.read(jsonStr);
    tokenizer.tokenize();
    const tokens = tokenizer.getTokens();
    expect(tokens.length).toEqual(2);
    expect(tokens[0].type).toEqual(TokenType.NULL);
    expect(tokens[0].value).toEqual(null);
    expect(tokens[1].type).toEqual(TokenType.END_JSON);
    expect(tokens[1].value).toEqual("EOF");
  });

  test("Test '[1, 2, 3]'", async () => {
    const jsonStr = "[1, 2, 3]";
    const tokenizer = new Tokenizer();
    tokenizer.read(jsonStr);
    tokenizer.tokenize();
    const tokens = tokenizer.getTokens();
    expect(tokens.length).toEqual(8);
    expect(tokens[0].type).toEqual(TokenType.BEGIN_ARRAY);
    expect(tokens[0].value).toEqual("[");
    expect(tokens[1].type).toEqual(TokenType.NUMBER);
    expect(tokens[1].value).toEqual(1);
    expect(tokens[2].type).toEqual(TokenType.COMMA);
    expect(tokens[2].value).toEqual(",");
    expect(tokens[3].type).toEqual(TokenType.NUMBER);
    expect(tokens[3].value).toEqual(2);
    expect(tokens[4].type).toEqual(TokenType.COMMA);
    expect(tokens[4].value).toEqual(",");
    expect(tokens[5].type).toEqual(TokenType.NUMBER);
    expect(tokens[5].value).toEqual(3);
    expect(tokens[6].type).toEqual(TokenType.END_ARRAY);
    expect(tokens[6].value).toEqual("]");
    expect(tokens[7].type).toEqual(TokenType.END_JSON);
    expect(tokens[7].value).toEqual("EOF");
  });

  test('Test {"a": 1}', async () => {
    const jsonStr= '{"a": 1}';
    const tokenizer = new Tokenizer();
    tokenizer.read(jsonStr);
    tokenizer.tokenize();
    const tokens = tokenizer.getTokens();
  });

  test('Test {"a": 1, "b": 2, "c": "hello world!", "d": true, "e": false, "f": null}', async () => {
    const jsonStr =
      '{"a": 1, "b": 2, "c": "hello world!", "d": true, "e": false, "f": null}';
    const tokenizer = new Tokenizer();
    tokenizer.read(jsonStr);
    tokenizer.tokenize();
    const tokens = tokenizer.getTokens();
  });

  test('Test {"a": {"b": 1}}', async () => {
    const jsonStr = '{"a": {"b": 1}}';
    const tokenizer = new Tokenizer();
    tokenizer.read(jsonStr);
    tokenizer.tokenize();
    const tokens = tokenizer.getTokens();
  });

  test('Test {"foo": {"bar": 1.03, "baz": "-hello\n"}}', async () => {
    const jsonStr = '{"foo": {"bar": 1.03, "baz": "-hello\n"}}';
    const tokenizer = new Tokenizer();
    tokenizer.read(jsonStr);
    tokenizer.tokenize();
    const tokens = tokenizer.getTokens();
  });

  test("Test [1, [2, 3]]", async () => {
    const jsonStr = "[1, [2, 3]]";
    const tokenizer = new Tokenizer();
    tokenizer.read(jsonStr);
    tokenizer.tokenize();
    const tokens = tokenizer.getTokens();
  });

  test('Test {"a":{"b":[1,2,{"c":{"d":1,"e":true,"f":null,"g":[{"h":100},{"h":200}]}}]}}}', async () => {
    const jsonStr =
      '{"a":{"b":[1,2,{"c":{"d":1,"e":true,"f":null,"g":[{"h":100},{"h":200}]}}]}}}';
    const tokenizer = new Tokenizer();
    tokenizer.read(jsonStr);
    tokenizer.tokenize();
    const tokens = tokenizer.getTokens();
  });

  test('Test {"a: "abc"}', async () => {
    const fn = () => {
      const jsonStr = '{"a: "abc"}';
      const tokenizer = new Tokenizer();
      tokenizer.read(jsonStr);
      tokenizer.tokenize();
      const tokens = tokenizer.getTokens();
    }
    expect(fn).toThrow(/Invalid JSON input./);
  });

  test('Test {"a": abc}', async () => {
    const fn = () => {
      const jsonStr = '{"a: abc}';
      const tokenizer = new Tokenizer();
      tokenizer.read(jsonStr);
      tokenizer.tokenize();
      const tokens = tokenizer.getTokens();
    }
    expect(fn).toThrow(/Invalid JSON input./);
  });
});
