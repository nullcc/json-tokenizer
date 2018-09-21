# JSON Tokenizer

## Usages

```javascript
import Tokenizer from 'json-tokenizer';

const jsonStr = '{"a": {"b": 1}}';
const tokenizer = new Tokenizer();
tokenizer.read(jsonStr);
tokenizer.tokenize();
const tokens = tokenizer.getTokens();
console.log(tokens);

// outputs:

// [ Token { type: 'BEGIN_OBJECT', value: '{' },
//   Token { type: 'STRING', value: 'a' },
//   Token { type: 'COLON', value: ':' },
//   Token { type: 'BEGIN_OBJECT', value: '{' },
//   Token { type: 'STRING', value: 'b' },
//   Token { type: 'COLON', value: ':' },
//   Token { type: 'NUMBER', value: 1 },
//   Token { type: 'END_OBJECT', value: '}' },
//   Token { type: 'END_OBJECT', value: '}' },
//   Token { type: 'END_JSON', value: 'EOF' } ]
```
