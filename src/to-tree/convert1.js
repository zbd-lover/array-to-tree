import isNothing from '../util/is-nothing'

/** The first-level element in result as the topest branch node */
export default function convert1 (data, adapter) {
  const result = []
  const nodeMap = new Map()

  const {
    id = 'id',
    parent_id = 'parent_id',
    children_prop = 'children',
    parent_prop,
    container_prop,
  } = adapter

  const createNode = (() => {
    if (container_prop) {
      if (parent_prop) {
        return (value) => {
          const node = {}
          node[parent_prop] = null
          node[children_prop] = []
          node[container_prop] = value
          return node
        }
      } else {
        return (value) => {
          const node = {}
          node[container_prop] = value
          node[children_prop] = []
          return node
        }
      }
    } else {
      if (parent_prop) {
        return (value) => {
          const node = value
          node[children_prop] = []
          node[parent_prop] = null
          return node
        }
      } else {
        return (value) => {
          value[children_prop] = []
          return value
        }
      }
    }
  })()

  for (let i = 0, node, nodeId, nodePId, shouleHasParent, vnodeSelf, parent; i < data.length; i++) {
    node = createNode(data[i])
    nodeId = data[i][id]
    nodePId = data[i][parent_id]
    
    vnodeSelf = nodeMap.get(nodeId)
    parent = nodeMap.get(nodePId)

    /** the node as the topest branch node. */
    shouleHasParent = !isNothing(nodePId)
    if (!parent && shouleHasParent) {
      const vnode = createNode({})
      nodeMap.set(nodePId, vnode)
      parent = vnode
    }

    if (shouleHasParent && parent_prop) {
      node[parent_prop] = parent
    }

    const realNode = vnodeSelf || node

    if (vnodeSelf) {
      // merge node
      const c = vnodeSelf[children_prop]
      Object.assign(vnodeSelf, node)
      vnodeSelf[children_prop] = c
    } else {
      nodeMap.set(nodeId, node)
    }

    if (shouleHasParent) {
      parent[children_prop].push(realNode)
    } else {
      result.push(realNode)
    }
  }
  nodeMap.clear()
  return result
}