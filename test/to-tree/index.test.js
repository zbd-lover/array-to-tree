import arrayToTree from '../../src/to-tree'

describe('test a-to-t options ', () => {
  test('should return a empty array, when source isn\'t a array', () => {
    expect(arrayToTree(1, {})).toEqual([])
  })

  test('should return a emtpy, array when source is a empty array', () => {
    expect(arrayToTree([], {})).toEqual([])
  })

  test('no error', () => {
    expect(() =>
      arrayToTree([], {
        root: 'branch',
        id: '_id',
        parent_id: 'p_id',
        parent_prop: 'parent',
        children_prop: 'children',
      })
    ).not.toThrow()
  })

  test('no error', () => {
    expect(() =>
      arrayToTree([], {
        root: 'leaf',
        id: '_id',
        parent_id: 'p_id',
        parent_prop: 'parent',
        children_prop: 'children',
        container_prop: 'data',
      })
    ).not.toThrow()
  })

  test('throw error, if adapter is not a plain object', () => {
    expect(() => arrayToTree([], 123)).toThrow()
  })

  test('throw error, if adapter.id equals adapter.parent_id', () => {
    expect(() =>
      arrayToTree([], {
        id: '_id',
        parent_id: '_id',
        children_prop: 'children',
      })
    ).toThrow()
  })

  test('throw error, if adapter.root is neither \'branch\' or \'leaf\'', () => {
    expect(() =>
      arrayToTree([], {
        id: '_id',
        parent_id: 'p_id',
        children_prop: 'children',
        root: 'error',
      })
    ).toThrow()
  })

  test('throw error, if adapter.id isn\'t as not empty string', () => {
    expect(() =>
      arrayToTree([], {
        id: [],
        parent_id: 'p_id',
        children_prop: 'children',
        parent_prop: 'parent',
      })
    ).toThrow()
  })

  test('throw error, if adapter.parent_id isn\'t as not empty string', () => {
    expect(() =>
      arrayToTree([], {
        id: '_id',
        parent_id: new Date(),
        children_prop: 'children',
        parent_prop: 'parent',
      })
    ).toThrow()
  })

  test('throw error, if adapter.children_prop isn\'t as not empty string', () => {
    expect(() =>
      arrayToTree([], {
        id: '_id',
        parent_id: 'p_id',
        children_prop: {},
      })
    ).toThrow()
  })

  test('throw error, if adapter.parent_prop isn\'t as not empty string', () => {
    expect(() =>
      arrayToTree([], {
        id: '_id',
        parent_id: 'p_id',
        parent_prop: 123,
      })
    ).toThrow()
  })

  test('throw error, if adapter.container_prop isn\'t as not empty string', () => {
    expect(() =>
      arrayToTree([], {
        id: '_id',
        parent_id: 'p_id',
        parent_prop: 'parent',
        children_prop: 'children',
        container_prop: {},
      })
    ).toThrow()
  })
})
