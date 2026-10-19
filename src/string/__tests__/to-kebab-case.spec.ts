import { toKebabCase } from '~/string';

describe('[toKebabCase]: convert camelCase or PascalCase to kebab-case', () => {
  it('should return an empty string for empty input', () => {
    expect(toKebabCase('')).toBe('');
  });

  it('should hyphenate camelCase and lowercase it', () => {
    expect(toKebabCase('helloWorld')).toBe('hello-world');
    expect(toKebabCase('borderTopLeftRadius')).toBe('border-top-left-radius');
  });

  it('should hyphenate PascalCase without a leading hyphen', () => {
    expect(toKebabCase('HelloWorld')).toBe('hello-world');
  });

  it('should hyphenate between a digit and an uppercase letter', () => {
    expect(toKebabCase('hello123World')).toBe('hello123-world');
    expect(toKebabCase('h1Title')).toBe('h1-title');
  });

  it('should keep consecutive capitals together as one word', () => {
    expect(toKebabCase('userID')).toBe('user-id');
    expect(toKebabCase('XMLHttpRequest')).toBe('xmlhttp-request');
  });

  it('should lowercase a single character', () => {
    expect(toKebabCase('a')).toBe('a');
    expect(toKebabCase('A')).toBe('a');
  });

  it('should leave kebab-case input unchanged', () => {
    expect(toKebabCase('hello-world')).toBe('hello-world');
  });

  it('should be idempotent', () => {
    const once = toKebabCase('someLongPropertyName');

    expect(toKebabCase(once)).toBe(once);
  });

  it('should lowercase non-ASCII capitals', () => {
    expect(toKebabCase('ÜberCool')).toBe('über-cool');
  });
});

describe('[toKebabCase]: letters beyond ASCII', () => {
  it('should split at capitals and lowercase letters beyond ASCII', () => {
    expect(toKebabCase('caféBar')).toBe('café-bar');
    expect(toKebabCase('helloÜber')).toBe('hello-über');
  });
});
