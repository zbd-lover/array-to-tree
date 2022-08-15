import isNothing from '../../src/util/is-nothing'

test('test isNothing tool function', () => {
  expect(isNothing(null)).toBe(true)
  expect(isNothing(void 0)).toBe(true)
  expect(isNothing('')).toBe(true)
  expect(isNothing(1234)).toBe(false)
  expect(isNothing('123')).toBe(false)
  expect(isNothing({ test: new Date() })).toBe(false)
  expect(isNothing([1, 23])).toBe(false)
  expect(isNothing(Symbol(true))).toBe(false)
  expect(isNothing(() => null)).toBe(false)
  expect(isNothing(NaN)).toBe(false)
  expect(isNothing(Infinity)).toBe(false)
})
