import isNothing from '../util/is-nothing'

/** The first-level element in result as leaf node */
export default function convert2 (data, adapter) {
  const nodeMap = new Map()
  const isBranchMap = new Map()

  const {
    id = 'id',
    parent_id = 'parent_id',
    parent_prop = 'parent',
    children_prop,
    container_prop,
  } = adapter

  const createNode = (() => {
    if (container_prop) {
      if (children_prop) {
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
          node[parent_prop] = null
          node[container_prop] = value
          return node
        }
      }
    }
    if (children_prop) {
      return (value) => {
        value[parent_prop] = null
        value[children_prop] = []
        return value
      }
    } else {
      return (value) => {
        value[parent_prop] = null
        return value
      }
    }
  })()

  for (let i = 0, node, nodeId, nodePId, vnodeSelf, parent, shouleHasParent; i < data.length; i++) {
    node = createNode(data[i])
    nodeId = data[i][id]
    nodePId = data[i][parent_id]
    shouleHasParent = !isNothing(nodePId)

    isBranchMap.set(nodeId, false)
    shouleHasParent && isBranchMap.set(nodePId, true)

    parent = nodeMap.get(nodePId) || null
    if (!parent && shouleHasParent) {
      const vnode = createNode({})
      nodeMap.set(nodePId, vnode)
      parent = vnode
    }

    node[parent_prop] = parent

    vnodeSelf = nodeMap.get(nodeId)
    if (vnodeSelf) {
      const children = children_prop ? vnodeSelf[children_prop] : null
      Object.assign(vnodeSelf, node)
      children && (vnodeSelf[children_prop] = children)
      children_prop && parent && parent[children_prop].push(vnodeSelf)
    } else {
      nodeMap.set(nodeId, node)
      children_prop && parent && parent[children_prop].push(node)
    }
  }

  const leafNodeIds = []
  for (let [id, flag] of isBranchMap.entries()) {
    if (!flag && id) leafNodeIds.push(id)
  }

  const result = leafNodeIds.map((id) => nodeMap.get(id))
  nodeMap.clear()

  return result
}
