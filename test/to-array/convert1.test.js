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

const target = [
  {
    _id: 1,
  },
  {
    _id: 7,
    p_id: 1,
  },
  {
    _id: 2,
    p_id: 7,
  },
  {
    _id: 5,
    p_id: 2,
  },
  {
    _id: 4,
    p_id: 7,
  },
  {
    _id: 3,
    p_id: 4,
    state: {
      name: 'zbd',
    },
  },
  {
    _id: 100,
    p_id: 3,
  },
]

describe('test root=\'branch\', tree to array.', () => {
  test('specify children_prop', () => {
    const nodes = treeToArray(data1, {
      id: '_id',
      root: 'branch',
      children_prop: 'children',
      parent_prop: 'parent',
    })
    expect(nodes).toEqual(target)
  })

  test('specify children_prop and container_prop', () => {
    const nodes = treeToArray(data2, {
      id: '_id',
      children_prop: 'children',
      container_prop: 'data',
      parent_prop: 'parent',
    })
    expect(nodes).toEqual(target)
  })
})
