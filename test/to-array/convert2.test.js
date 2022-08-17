import clone from 'clone'
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

describe('test root=\'leaf\', tree to array.', () => {
  test('specify parent_prop', () => {
    const origin = clone(data1)
    const config = {
      id: '_id',
      root: 'leaf',
      parent_prop: 'parent',
    }
    const nodes = treeToArray(clone(data1), config)
    expect(nodes).valueCheck4({
      origin,
      idKey: config.id,
      parent_prop: config.parent_prop
    })
  })

  test('specify children_prop and container_prop', () => {
    const origin = clone(data2)
    const config = {
      id: '_id',
      root: 'leaf',
      parent_prop: 'parent',
      container_prop: 'data'
    }
    const nodes = treeToArray(clone(data2), config)
    expect(nodes).valueCheck4({
      origin,
      idKey: config.id,
      parent_prop: config.parent_prop,
      container_prop: config.container_prop
    })
  })
})
