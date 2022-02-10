import parseSelector from '../parse';

test('Parses common selectors', () => {
  expect(parseSelector('button')).toEqual({ role: 'button', attributes: [] });

  expect(parseSelector('button[name="Hello World"]')).toEqual({
    role: 'button',
    attributes: [
      {
        name: 'name',
        value: 'Hello World',
        caseSensitive: true,
      },
    ],
  });

  expect(parseSelector('heading[level=2]')).toEqual({
    role: 'heading',
    attributes: [
      {
        name: 'level',
        value: 2,
      },
    ],
  });

  expect(parseSelector('button[pressed]')).toEqual({
    role: 'button',
    attributes: [
      {
        name: 'pressed',
        value: true,
      },
    ],
  });

  expect(parseSelector('button[name="Hello World"][pressed]')).toEqual({
    role: 'button',
    attributes: [
      {
        name: 'name',
        value: 'Hello World',
        caseSensitive: true,
      },
      {
        name: 'pressed',
        value: true,
      },
    ],
  });
});

describe('Grammar', () => {
  test('Valid grammar', () => {
    expect(parseSelector(' button [ name = "Hello World" ]  ')).toEqual({
      role: 'button',
      attributes: [
        {
          name: 'name',
          value: 'Hello World',
          caseSensitive: true,
        },
      ],
    });

    expect(parseSelector(' heading [ pressed ] [level  =  3 ] ')).toEqual({
      role: 'heading',
      attributes: [
        {
          name: 'pressed',
          value: true,
        },
        {
          name: 'level',
          value: 3,
        },
      ],
    });
  });

  test('Invalid grammar', () => {
    expect(parseSelector('button[role="button"]')).toEqual({
      role: 'button',
      attributes: [
        {
          name: 'role',
          value: 'button',
          caseSensitive: true,
        },
      ],
    });

    expect(parseSelector('button[name="Button 1"][name="Button 2"]')).toEqual({
      role: 'button',
      attributes: [
        {
          name: 'name',
          value: 'Button 1',
          caseSensitive: true,
        },
        {
          name: 'name',
          value: 'Button 2',
          caseSensitive: true,
        },
      ],
    });
  });

  test('Error grammar', () => {
    expect(() => parseSelector('')).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected end of selector while parsing selector \`\`"`
    );

    expect(() => parseSelector('button[')).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected end of selector while parsing selector \`button[\`"`
    );

    expect(() => parseSelector('button[]')).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`button[]\` - unexpected symbol \\"]\\" at position 7 during parsing identifier"`
    );

    expect(() => parseSelector('[]')).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`[]\` - unexpected symbol \\"[\\" at position 0 during parsing identifier"`
    );

    expect(() => parseSelector('[]button')).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`[]button\` - unexpected symbol \\"[\\" at position 0 during parsing identifier"`
    );
  });
});

describe('Role', () => {
  test('Valid roles', () => {
    expect(parseSelector('button')).toEqual(
      expect.objectContaining({ role: 'button' })
    );

    expect(parseSelector('textbox')).toEqual(
      expect.objectContaining({ role: 'textbox' })
    );
  });

  test('Invalid roles', () => {
    expect(parseSelector('BUTTON')).toEqual(
      expect.objectContaining({ role: 'BUTTON' })
    );

    expect(parseSelector('somerole')).toEqual(
      expect.objectContaining({ role: 'somerole' })
    );
  });

  test('Error roles', () => {
    expect(() => parseSelector('123')).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`123\` - unexpected symbol \\"1\\" at position 0 during parsing identifier"`
    );

    expect(() =>
      parseSelector('Hello World')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`Hello World\` - unexpected symbol \\"W\\" at position 6"`
    );
  });
});

describe('String', () => {
  test('Valid strings', () => {
    expect(
      parseSelector('button[name="Hello World"]').attributes
    ).toContainEqual({
      name: 'name',
      value: 'Hello World',
      caseSensitive: true,
    });

    expect(
      parseSelector('button[name="\\Hello\\" \nWorld\\""]').attributes
    ).toContainEqual({
      name: 'name',
      value: '\\Hello" \nWorld"',
      caseSensitive: true,
    });

    expect(
      parseSelector("button[name='Hello World']").attributes
    ).toContainEqual({
      name: 'name',
      value: 'Hello World',
      caseSensitive: true,
    });

    expect(
      parseSelector("button[name='Hello\\' World']").attributes
    ).toContainEqual({
      name: 'name',
      value: "Hello' World",
      caseSensitive: true,
    });

    expect(
      parseSelector('button[name="Hello World"i]').attributes
    ).toContainEqual({
      name: 'name',
      value: 'Hello World',
      caseSensitive: false,
    });

    expect(
      parseSelector('button[name="Hello World"I]').attributes
    ).toContainEqual({
      name: 'name',
      value: 'Hello World',
      caseSensitive: false,
    });

    expect(
      parseSelector('button[name="Hello World"s]').attributes
    ).toContainEqual({
      name: 'name',
      value: 'Hello World',
      caseSensitive: true,
    });

    expect(
      parseSelector('button[name="Hello World"S]').attributes
    ).toContainEqual({
      name: 'name',
      value: 'Hello World',
      caseSensitive: true,
    });
  });

  test('Error strings', () => {
    expect(() =>
      parseSelector('button[name="Hello World\']')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected end of selector while parsing selector \`button[name=\\"Hello World']\`"`
    );

    expect(() =>
      parseSelector('button[name=Hello World]')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`button[name=Hello World]\` - unexpected symbol \\" \\" at position 17 during parsing attribute value"`
    );
  });
});

describe('RegExp', () => {
  test('Valid regexps', () => {
    expect(
      parseSelector('button[name=/Hello World/]').attributes
    ).toContainEqual({
      name: 'name',
      value: /Hello World/,
    });

    expect(
      parseSelector('button[name=/Hello World/gi]').attributes
    ).toContainEqual({
      name: 'name',
      value: /Hello World/gi,
    });

    expect(
      parseSelector('button[name=/He\\\\llo\\s+ [wW]orld.*\\n/m]').attributes
    ).toContainEqual({
      name: 'name',
      value: /He\\llo\s+ [wW]orld.*\n/m,
    });

    const regexp = /^Hello\s* \\[wW]or.ld\n$/im;
    expect(parseSelector(`button[name=${regexp}]`).attributes).toContainEqual({
      name: 'name',
      value: regexp,
    });
  });

  test('Error regexps', () => {
    expect(() =>
      parseSelector('button[name=/Hello World/a]')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`button[name=/Hello World/a]\` - unexpected symbol \\"a\\" at position 25 during parsing attribute value"`
    );

    expect(() =>
      parseSelector('button[name=/Hello World]')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected end of selector while parsing selector \`button[name=/Hello World]\`"`
    );

    expect(() =>
      parseSelector('button[name=/Hello World')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected end of selector while parsing selector \`button[name=/Hello World\`"`
    );

    expect(() =>
      parseSelector('button[name=/Hello/ World/]')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`button[name=/Hello/ World/]\` - unexpected symbol \\"W\\" at position 20 during parsing attribute value"`
    );
  });
});

describe('Number', () => {
  test('Valid numbers', () => {
    expect(parseSelector('heading[level=2]').attributes).toContainEqual({
      name: 'level',
      value: 2,
    });

    expect(parseSelector('heading[level=6]').attributes).toContainEqual({
      name: 'level',
      value: 6,
    });

    expect(parseSelector('heading[level=1]').attributes).toContainEqual({
      name: 'level',
      value: 1,
    });
  });

  test('Invalid numbers', () => {
    expect(parseSelector('heading[level=100]').attributes).toContainEqual({
      name: 'level',
      value: 100,
    });

    expect(parseSelector('heading[level=0]').attributes).toContainEqual({
      name: 'level',
      value: 0,
    });
  });
});

describe('Boolean', () => {
  test('Valid booleans', () => {
    expect(parseSelector('button[pressed]').attributes).toContainEqual({
      name: 'pressed',
      value: true,
    });

    expect(parseSelector('button[pressed=true]').attributes).toContainEqual({
      name: 'pressed',
      value: true,
    });

    expect(parseSelector('button[pressed=false]').attributes).toContainEqual({
      name: 'pressed',
      value: false,
    });
  });

  test('Error booleans', () => {
    expect(() =>
      parseSelector('button[pressed=False]')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`button[pressed=False]\` - unexpected symbol \\"]\\" at position 20 during parsing attribute value"`
    );

    expect(() =>
      parseSelector('button[pressed=True]')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`button[pressed=True]\` - unexpected symbol \\"]\\" at position 19 during parsing attribute value"`
    );

    expect(() =>
      parseSelector('button[pressed=FALSE]')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`button[pressed=FALSE]\` - unexpected symbol \\"]\\" at position 20 during parsing attribute value"`
    );

    expect(() =>
      parseSelector('button[pressed=tru]')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error while parsing selector \`button[pressed=tru]\` - unexpected symbol \\"]\\" at position 18 during parsing attribute value"`
    );
  });
});
