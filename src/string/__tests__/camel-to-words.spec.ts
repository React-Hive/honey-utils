import { camelToWords } from '~/string';

describe('[camelToWords]: split camelCase or PascalCase into words', () => {
  it('should return an empty string for empty input', () => {
    expect(camelToWords('')).toBe('');
  });

  it('should insert a space between a lowercase and an uppercase letter', () => {
    expect(camelToWords('helloWorld')).toBe('hello World');
    expect(camelToWords('backgroundColorValue')).toBe('background Color Value');
  });

  it('should split PascalCase without a leading space', () => {
    expect(camelToWords('HelloWorld')).toBe('Hello World');
  });

  it('should keep the original capitalization of each word', () => {
    expect(camelToWords('iPhoneCase')).toBe('i Phone Case');
  });

  it('should separate a trailing acronym from the word before it', () => {
    expect(camelToWords('userID')).toBe('user ID');
  });

  it('should insert a space between a digit and an uppercase letter', () => {
    expect(camelToWords('item2Count')).toBe('item2 Count');
    expect(camelToWords('version10Beta')).toBe('version10 Beta');
  });

  it('should return a single character unchanged', () => {
    expect(camelToWords('a')).toBe('a');
    expect(camelToWords('A')).toBe('A');
  });

  it('should return a single lowercase word unchanged', () => {
    expect(camelToWords('hello')).toBe('hello');
  });

  it('should leave input that is already split unchanged', () => {
    expect(camelToWords('hello World')).toBe('hello World');
  });
});

describe('[camelToWords]: capital runs and letters beyond ASCII', () => {
  it('should split a run of capitals from the word after it', () => {
    expect(camelToWords('userIDNumber')).toBe('user ID Number');
    expect(camelToWords('XMLHttpRequest')).toBe('XML Http Request');
  });

  it('should split at capitals and lowercase letters beyond ASCII', () => {
    expect(camelToWords('caféBar')).toBe('café Bar');
    expect(camelToWords('helloÜber')).toBe('hello Über');
  });
});
