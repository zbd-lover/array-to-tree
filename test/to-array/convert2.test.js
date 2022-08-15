import treeToArray from '../../src/to-array'

const data1 = [
  {
    _id: 5,
    p_id: 2,
    parent: {
      _id: 2,
      p_id: 7,
      parent: {
        _id: 7,
        p_id: 1,
        parent: {
          _id: 1,
          parent: null,
        },
      },
    },
  },
  {
    _id: 100,
    p_id: 3,
    parent: {
      _id: 3,
      p_id: 4,
      state: {
        name: 'zbd',
      },
      parent: {
        _id: 4,
        p_id: 7,
        parent: {
          _id: 7,
          p_id: 1,
          parent: {
            _id: 1,
            parent: null,
          },
        },
      },
    },
  },
]

const data2 = [
  {
    data: {
      _id: 5,
      p_id: 2,
    },
    parent: {
      data: {
        _id: 2,
        p_id: 7,
      },
      parent: {
        data: {
          _id: 7,
          p_id: 1,
        },
        parent: {
          data: {
            _id: 1,
          },
          parent: null,
        },
      },
    },
  },
  {
    data: {
      _id: 100,
      p_id: 3,
    },
    parent: {
      data: {
        _id: 3,
        p_id: 4,
        state: {
          name: 'zbd',
        },
      },
      parent: {
        data: {
          _id: 4,
          p_id: 7,
        },
        parent: {
          data: {
            _id: 7,
            p_id: 1,
          },
          parent: {
            data: {
              _id: 1,
            },
            parent: null,
          },
        },
      },
    },
  },
]

const target = [
  {
    _id: 5,
    p_id: 2,
  },
  {
    _id: 2,
    p_id: 7,
  },
  {
    _id: 7,
    p_id: 1,
  },
  {
    _id: 1,
  },
  {
    _id: 100,
    p_id: 3,
  },
  {
    _id: 3,
    p_id: 4,
    state: {
      name: 'zbd',
    },
  },
  {
    _id: 4,
    p_id: 7,
  },
]

describe('test root=\'leaf\', tree to array.', () => {
  test('specify children_prop', () => {
    const nodes = treeToArray(data1, {
      id: '_id',
      root: 'leaf',
      children_prop: 'children',
    })
    expect(nodes).toEqual(target)
  })

  test('specify children_prop and container_prop', () => {
    const nodes = treeToArray(data2, {
      id: '_id',
      root: 'leaf',
      children_prop: 'children',
      container_prop: 'data',
    })
    expect(nodes).toEqual(target)
  })
})
