/**
 * This file is heavily based on Playwright's `parseComponentSelector`, altered for this library's usage.
 * @see https://github.com/microsoft/playwright/blob/585807b3bea6a998019200c16b06683115011d87/src/server/common/componentUtils.ts
 *
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

interface ParsedAttribute {
  name: string;
  value: string | number | boolean | RegExp;
  caseSensitive?: boolean;
}

interface ParsedSelector {
  role: string;
  attributes: ParsedAttribute[];
}

function parseSelector(selector: string): ParsedSelector {
  let wp = 0;
  let EOL = selector.length === 0;

  const next = () => selector[wp] || '';
  const eat1 = () => {
    const result = next();
    ++wp;
    EOL = wp >= selector.length;
    return result;
  };

  const syntaxError = (stage: string | undefined) => {
    if (EOL)
      throw new Error(
        `Unexpected end of selector while parsing selector \`${selector}\``
      );
    throw new Error(
      `Error while parsing selector \`${selector}\` - unexpected symbol "${next()}" at position ${wp}` +
        (stage ? ' during ' + stage : '')
    );
  };

  function skipSpaces() {
    while (!EOL && /\s/.test(next())) eat1();
  }

  function readIdentifier() {
    let result = '';
    skipSpaces();
    while (!EOL && /[a-zA-Z]/.test(next())) result += eat1();
    if (!result) syntaxError('parsing identifier');
    return result;
  }

  function readQuotedString(quote: string) {
    let result = eat1();
    if (result !== quote) syntaxError('parsing quoted string');
    while (!EOL && next() !== quote) {
      const cur = eat1();
      if (cur === '\\' && next() === quote) {
        result += eat1();
      } else {
        result += cur;
      }
    }
    if (next() !== quote) syntaxError('parsing quoted string');
    result += eat1();
    return result;
  }

  function readRegexString() {
    if (eat1() !== '/') syntaxError('parsing regex string');
    let pattern = '';
    let flags = '';
    while (!EOL && next() !== '/') {
      // if (next() === '\\') eat1();
      pattern += eat1();
    }
    if (eat1() !== '/') syntaxError('parsing regex string');
    while (!EOL && /[dgimsuy]/.test(next())) {
      flags += eat1();
    }
    return [pattern, flags];
  }

  function readOperator() {
    skipSpaces();
    let op;
    if (!EOL) op = eat1();
    if (op !== '=') {
      syntaxError('parsing operator');
    }
    return op;
  }

  function readAttribute(): ParsedAttribute {
    // skip leading [
    eat1();

    // read attribute name:
    const name = readIdentifier();
    skipSpaces();
    // check property is true: [focused]
    if (next() === ']') {
      eat1();
      return { name, value: true };
    }

    readOperator();

    let value = undefined;
    let caseSensitive = undefined;
    skipSpaces();
    if (next() === `'` || next() === `"`) {
      caseSensitive = true;
      value = readQuotedString(next()).slice(1, -1);
      skipSpaces();
      if (next() === 'i' || next() === 'I') {
        caseSensitive = false;
        eat1();
      } else if (next() === 's' || next() === 'S') {
        caseSensitive = true;
        eat1();
      }
    } else if (next() === '/') {
      const [pattern, flags] = readRegexString();
      value = new RegExp(pattern, flags);
    } else {
      value = '';
      while (!EOL && !/\s/.test(next()) && next() !== ']') value += eat1();
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else {
        value = +value;
        if (isNaN(value)) syntaxError('parsing attribute value');
      }
    }
    skipSpaces();
    if (next() !== ']') syntaxError('parsing attribute value');

    eat1();
    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'boolean' &&
      !(value instanceof RegExp)
    )
      throw new Error(
        `Error while parsing selector \`${selector}\` - cannot use attribute ${name} with unsupported type ${typeof value} - ${value}`
      );

    const attribute: ParsedAttribute = { name, value };
    if (typeof caseSensitive !== 'undefined') {
      attribute.caseSensitive = caseSensitive;
    }
    return attribute;
  }

  const result: ParsedSelector = {
    role: '',
    attributes: [],
  };
  result.role = readIdentifier();
  skipSpaces();
  while (next() === '[') {
    result.attributes.push(readAttribute());
    skipSpaces();
  }
  if (!EOL) syntaxError(undefined);
  if (!result.role && !result.attributes.length)
    throw new Error(
      `Error while parsing selector \`${selector}\` - selector cannot be empty`
    );
  return result;
}

export default parseSelector;
