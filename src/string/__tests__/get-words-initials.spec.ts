import { getWordsInitials } from '~/string';

describe('[getWordsInitials]: uppercase initials of the words in a string', () => {
  it('should return an empty string for empty input', () => {
    expect(getWordsInitials('')).toBe('');
  });

  it('should return an empty string for input of spaces only', () => {
    expect(getWordsInitials('   ')).toBe('');
  });

  it('should return the initial of every word', () => {
    expect(getWordsInitials('John Ronald Reuel Tolkien')).toBe('JRRT');
  });

  it('should uppercase the initials', () => {
    expect(getWordsInitials('john doe')).toBe('JD');
  });

  it('should return the initial of a single word', () => {
    expect(getWordsInitials('alice')).toBe('A');
    expect(getWordsInitials('a')).toBe('A');
  });

  it('should ignore leading, trailing and repeated spaces', () => {
    expect(getWordsInitials('  John   Doe  ')).toBe('JD');
  });

  it('should limit the initials to the first maxWords words', () => {
    expect(getWordsInitials('John Ronald Reuel Tolkien', 2)).toBe('JR');
    expect(getWordsInitials('John Ronald Reuel Tolkien', 1)).toBe('J');
  });

  it('should return every initial when maxWords exceeds the word count', () => {
    expect(getWordsInitials('John Doe', 5)).toBe('JD');
  });

  it('should return an empty string when maxWords is 0', () => {
    expect(getWordsInitials('John Doe', 0)).toBe('');
  });

  it('should count words after skipping extra spaces when limiting', () => {
    expect(getWordsInitials('   John    Doe   Smith', 2)).toBe('JD');
  });

  it('should treat a hyphenated name as one word', () => {
    expect(getWordsInitials('Mary-Jane Watson')).toBe('MW');
  });

  it('should keep digits as initials', () => {
    expect(getWordsInitials('42 things')).toBe('4T');
  });

  it('should uppercase non-ASCII initials', () => {
    expect(getWordsInitials('émile zola')).toBe('ÉZ');
    expect(getWordsInitials('олена пчілка')).toBe('ОП');
  });
});

describe('[getWordsInitials]: characters outside the basic plane', () => {
  it('should take a whole emoji as an initial, not half of it', () => {
    expect(getWordsInitials('😀 smile')).toBe('😀S');
  });
});
