import isNothing from "../util/is-nothing"

/** 转换器2，每个结点只含有对父结点的引用时，返回所有叶子结点 */
export default function transform2(data, adapter) {
  const nodeMap = new Map()
  const isBranchMap = new Map()

  const {
    id = 'id',
    parent_id = 'parent_id',
    parent_prop,
    container_prop
  } = adapter

  const createNode = (() => {
    if (container_prop) {
      return (value) => {
        const node = {}
        node[parent_prop] = null
        node[container_prop] = value
        return node
      }
    }
    return (value) => {
      value[parent_prop] = null
      return value
    }
  })()

  for (let i = 0, node, nodeId, nodePId; i < data.length; i++) {
    node = createNode(data[i])
    nodeId = data[i][id]
    nodePId = data[i][parent_id]
    nodeValue = data[i]

    isBranchMap.set(nodeId, !!isBranchMap.get(nodeId))
    !isNothing(nodePId) && isBranchMap.set(nodePId, true)

    const _parent = nodeMap.get(nodePId) || null
    let parent = _parent
    if (!parent && !isNothing(nodePId)) {
      const vnode = createNode({})
      nodeMap.set(nodePId, vnode)
      parent = vnode
    }

    node[parent_prop] = parent

    const vnodeSelf = nodeMap.get(nodeId)
    if (vnodeSelf) {
      Object.assign(vnodeSelf, node)
    } else {
      nodeMap.set(nodeId, node)
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