import clone from 'clone'
import arrayToTree from '../../src/to-tree'

function randomSort (array) {
  array.sort(() => Math.random() < 0.5 ? 1 : -1)
  return array
}

const data = [
  {
    _id: 1,
  },
  {
    _id: 3,
    p_id: 4,
    state: {
      name: 'zbd',
    },
  },
  {
    _id: 5,
    p_id: 2,
  },
  {
    _id: 99,
    value: {
      babel: true
    }
  },
  {
    _id: 2,
    p_id: 7,
  },
  {
    _id: 4,
    p_id: 7,
  },
  {
    _id: 7,
    p_id: 1,
  },
  {
    _id: 100,
    p_id: 3,
  },
]

const data1 = [
  {
    id: 1,
    name: 'Node1',
    parent_id: undefined
  },
  {
    id: 2,
    name: 'Node2',
    parent_id: 1
  },
  {
    id: 3,
    name: 'Node3',
    parent_id: 2
  },
  {
    id: 4,
    name: 'Node4',
    parent_id: null
  }
]

describe('test root=\'branch\', array to tree.', () => {
  describe('check the value', () => {
    test('secify nothing', () => {
      const datasource = randomSort(clone(data1))
      const copy = clone(datasource)
      const nodes = arrayToTree(datasource)
      expect(nodes).valueCheck1({
        origin: copy,
        idKey: 'id',
        children_prop: 'children',
      })
    })
    test('specify children_prop only', () => {
      const config = {
        id: '_id',
        parent_id: 'p_id',
        children_prop: 'children',
        root: 'branch',
      }
      const datasource = randomSort(clone(data))
      const copy = clone(datasource)
      const nodes = arrayToTree(
        datasource,
        config
      )
      expect(nodes).valueCheck1({
        origin: copy,
        idKey: config.id,
        children_prop: config.children_prop,
      })
    })

    test('specify parent_prop only', () => {
      const config = {
        id: '_id',
        parent_id: 'p_id',
        parent_prop: 'parent',
        root: 'branch',
      }
      const datasource = randomSort(clone(data))
      const copy = clone(datasource)
      const nodes = arrayToTree(
        datasource,
        config
      )
      expect(nodes).valueCheck1({
        origin: copy,
        idKey: config.id,
        parent_prop: config.parent_prop,
        children_prop: 'children', // default
      })
    })

    test('specify container_prop only', () => {
      const config = {
        id: '_id',
        parent_id: 'p_id',
        container_prop: 'parent',
        root: 'branch',
      }
      const datasource = randomSort(clone(data))
      const copy = clone(datasource)
      const nodes = arrayToTree(
        datasource,
        config
      )
      expect(nodes).valueCheck1({
        origin: copy,
        idKey: config.id,
        container_prop: config.container_prop,
        children_prop: 'children', // default
      })
    })

    test('specify children_prop and container_prop', () => {
      const config = {
        id: '_id',
        parent_id: 'p_id',
        children_prop: 'children',
        container_prop: 'data',
        root: 'branch',
      }
      const datasource = randomSort(clone(data))
      const copy = clone(datasource)
      const nodes = arrayToTree(
        datasource,
        config
      )
      expect(nodes).valueCheck1({
        origin: copy,
        idKey: config.id,
        children_prop: config.children_prop,
        container_prop: config.container_prop
      })
    })

    test('specify children_prop and parent_prop', () => {
      const config = {
        id: '_id',
        parent_id: 'p_id',
        children_prop: 'children',
        parent_prop: 'data',
        root: 'branch',
      }
      const datasource = randomSort(clone(data))
      const copy = clone(datasource)
      const nodes = arrayToTree(
        datasource,
        config
      )
      expect(nodes).valueCheck1({
        origin: copy,
        idKey: config.id,
        children_prop: config.children_prop,
        parent_prop: config.parent_prop
      })
    })

    test('specify parent_prop and container_prop', () => {
      const config = {
        id: '_id',
        parent_id: 'p_id',
        parent_prop: 'parent',
        container_prop: 'data',
        root: 'branch',
      }
      const datasource = randomSort(clone(data))
      const copy = clone(datasource)
      const nodes = arrayToTree(
        datasource,
        config
      )
      expect(nodes).valueCheck1({
        origin: copy,
        idKey: config.id,
        children_prop: 'children', // default
        container_prop: config.container_prop,
        parent_prop: config.parent_prop
      })
    })

    test('specify specify children_prop, container_prop and parent_prop', () => {
      const config = {
        id: '_id',
        parent_id: 'p_id',
        children_prop: 'children1',
        container_prop: 'data',
        parent_prop: 'parent',
        root: 'branch',
      }
      const datasource = randomSort(clone(data))
      const copy = clone(datasource)
      const nodes = arrayToTree(
        datasource,
        config
      )
      expect(nodes).valueCheck1({
        origin: copy,
        idKey: config.id,
        children_prop: config.children_prop,
        container_prop: config.container_prop,
        parent_prop: config.parent_prop
      })
    })
  })

  describe('check the value reference', () => {
    test('specify children_prop and parent_prop', () => {
      const nodes = arrayToTree(clone(data), {
        id: '_id',
        parent_id: 'p_id',
        children_prop: 'children',
        parent_prop: 'parent',
        root: 'branch',
      })
      expect(nodes).isInfiniteRef1()
    })

    test('specify children_prop and parent_prop and container_prop', () => {
      const nodes = arrayToTree(clone(data), {
        id: '_id',
        parent_id: 'p_id',
        children_prop: 'children',
        parent_prop: 'parent',
        container_prop: 'data',
        root: 'branch',
      })
      expect(nodes).isInfiniteRef1()
    })
  })
})
