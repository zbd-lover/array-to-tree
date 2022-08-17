import clone from 'clone'
import treeToArray from '../../src/to-array'

const data1 = [
  {
    _id: 1,
    parent: null,
    children: [
      {
        _id: 7,
        p_id: 1,
        children: [
          {
            _id: 2,
            p_id: 7,
            children: [
              {
                _id: 5,
                p_id: 2,
                children: [],
              },
            ],
          },
          {
            _id: 4,
            p_id: 7,
            parent: null,
            children: [
              {
                _id: 3,
                p_id: 4,
                state: {
                  name: 'zbd',
                },
                children: [
                  {
                    _id: 100,
                    p_id: 3,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

const data2 = [
  {
    data: {
      _id: 1,
    },
    children: [
      {
        data: {
          _id: 7,
          p_id: 1,
        },
        children: [
          {
            data: {
              _id: 2,
              p_id: 7,
            },
            children: [
              {
                data: {
                  _id: 5,
                  p_id: 2,
                },
                children: [],
              },
            ],
          },
          {
            data: {
              _id: 4,
              p_id: 7,
            },
            children: [
              {
                data: {
                  _id: 3,
                  p_id: 4,
                  state: {
                    name: 'zbd',
                  },
                },

                children: [
                  {
                    data: {
                      _id: 100,
                      p_id: 3,
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

describe('test root=\'branch\', tree to array.', () => {
  test('specify children_prop only', () => {
    const origin = clone(data1)
    const config = {
      id: '_id',
      root: 'branch',
      children_prop: 'children',
    }
    const nodes = treeToArray(data1, config)
    expect(nodes).valueCheck3({
      origin,
      idKey: config.id,
      children_prop: config.children_prop,
    })
  })

  test('specify container_prop only', () => {
    const origin = clone(data2)
    const config = {
      id: '_id',
      root: 'branch',
      container_prop: 'data'
    }
    const nodes = treeToArray(data2, config)
    expect(nodes).valueCheck3({
      origin,
      idKey: config.id,
      children_prop: 'children', // default
      container_prop: config.container_prop
    })
  })

  test('specify children_prop and container_prop only', () => {
    const origin = clone(data2)
    const config = {
      id: '_id',
      root: 'branch',
      children_prop: 'children',
      container_prop: 'data'
    }
    const nodes = treeToArray(data2, config)
    expect(nodes).valueCheck3({
      origin,
      idKey: config.id,
      children_prop: config.children_prop,
      container_prop: config.container_prop
    })
  })
})
