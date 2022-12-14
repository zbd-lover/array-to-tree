import treeToArray from '../../src/to-array'

describe('test t-to-a options', () => {
  test('should return a empty array, when source isn\'t a array', () => {
    expect(treeToArray(1, {})).toEqual([])
  })

  test('should return a emtpy, array when source is a empty array', () => {
    expect(treeToArray([], { id: '_id' })).toEqual([])
  })

  test('no error', () => {
    expect(() =>
      treeToArray([], {
        root: 'branch',
        id: '_id',
        parent_prop: 'parent',
        children_prop: 'children',
        container_prop: 'data',
      })
    ).not.toThrow()
  })

  test('no error', () => {
    expect(() =>
      treeToArray([], {
        root: 'leaf',
        id: '_id',
        parent_prop: 'parent',
        children_prop: 'children',
        container_prop: 'data',
      })
    ).not.toThrow()
  })

  test('throw error, if adapter is not a plain object', () => {
    expect(() => treeToArray([], 123)).toThrow()
  })

  test('throw error, if adapter.root is neither \'branch\' or \'leaf\'', () => {
    expect(() =>
      treeToArray([], {
        id: '_id',
        children_prop: 'children',
        root: 'error',
      })
    ).toThrow()
  })

  test('throw error, if adapter.id isn\'t as not empty string', () => {
    expect(() =>
      treeToArray([], {
        children_prop: 'children',
        parent_prop: 'parent',
      })
    ).toThrow()
  })

  test('throw error, if adapter.children_prop isn\'t as not empty string', () => {
    expect(() =>
      treeToArray([], {
        id: '_id',
        children_prop: {},
      })
    ).toThrow()
  })

  test('throw error, if adapter.parent_prop isn\'t as not empty string', () => {
    expect(() =>
      treeToArray([], {
        id: '_id',
        parent_prop: 123,
      })
    ).toThrow()
  })

  test('throw error, if adapter.container_prop isn\'t as not empty string', () => {
    expect(() =>
      treeToArray([], {
        id: '_id',
        parent_prop: 'parent',
        children_prop: 'children',
        container_prop: {},
      })
    ).toThrow()
  })
})
