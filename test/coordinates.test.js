import { describe, test, expect } from 'vitest';
import parseCoordinates from '../src/js/coordinates.js';

describe('parseCoordinates', () => {
  test('обрабатывает координаты с пробелом', () => {
    expect(parseCoordinates('51.50851, -0.12572')).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('обрабатывает координаты без пробела', () => {
    expect(parseCoordinates('51.50851,-0.12572')).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('обрабатывает координаты в квадратных скобках', () => {
    expect(parseCoordinates('[51.50851, −0.12572]')).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('выбрасывает ошибку при неправильном формате', () => {
    expect(() => parseCoordinates('abc, def')).toThrow();
  });

  test('выбрасывает ошибку при недопустимой широте', () => {
    expect(() => parseCoordinates('100, 50')).toThrow();
  });

  test('выбрасывает ошибку при недопустимой долготе', () => {
    expect(() => parseCoordinates('50, 200')).toThrow();
  });
});