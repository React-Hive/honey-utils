import { camelToDashCase } from '~/string';

describe('[camelToDashCase]: convert camelCase to dash-case', () => {
  it('should return an empty string for empty input', () => {
    expect(camelToDashCase('')).toBe('');
  });

  it('should insert a hyphen before each capital and lowercase it', () => {
    expect(camelToDashCase('helloWorld')).toBe('hello-world');
    expect(camelToDashCase('backgroundColor')).toBe('background-color');
    expect(camelToDashCase('borderTopLeftRadius')).toBe('border-top-left-radius');
  });

  it('should not add a leading hyphen when the input starts with a capital', () => {
    expect(camelToDashCase('HelloWorld')).toBe('hello-world');
    expect(camelToDashCase('WebkitTransform')).toBe('webkit-transform');
  });

  it('should lowercase a single character', () => {
    expect(camelToDashCase('a')).toBe('a');
    expect(camelToDashCase('A')).toBe('a');
  });

  it('should hyphenate every capital of an acronym on its own', () => {
    expect(camelToDashCase('userID')).toBe('user-i-d');
    expect(camelToDashCase('XMLHttpRequest')).toBe('x-m-l-http-request');
  });

  it('should keep digits attached to the preceding word', () => {
    expect(camelToDashCase('item2Count')).toBe('item2-count');
    expect(camelToDashCase('h1')).toBe('h1');
  });

  it('should leave a lowercase word unchanged', () => {
    expect(camelToDashCase('color')).toBe('color');
  });

  it('should leave dash-case input unchanged', () => {
    expect(camelToDashCase('background-color')).toBe('background-color');
  });

  it('should lowercase a non-ASCII first character', () => {
    expect(camelToDashCase('Ärger')).toBe('ärger');
  });
});

describe('[camelToDashCase]: letters beyond ASCII', () => {
  it('should dash and lowercase a capital beyond ASCII', () => {
    expect(camelToDashCase('helloÜber')).toBe('hello-über');
  });
});
