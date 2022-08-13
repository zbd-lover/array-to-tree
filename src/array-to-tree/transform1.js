import isNothing from "../util/is-nothing.js"

/** 转换器1，每个结点含有对子结点的引用时，返回所有的顶级分支结点 */
export default function transform1(data, adapter) {
  const result = []
  const nodeMap = new Map()

  const {
    id = 'id',
    parent_id = 'parent_id',
    children_prop = 'children',
    parent_prop,
    container_prop,
    is_sub_tree = (v) => isNothing(v[parent_id]),
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

  for (let i = 0, node, nodeId, nodePId, nodeValue; i < data.length; i++) {
    node = createNode(data[i])
    nodeId = data[i][id]
    nodePId = data[i][parent_id]
    nodeValue = data[i]

    // 是顶级分支结点
    if (is_sub_tree(nodeValue)) {
      nodeMap.set(nodeId, node)
      result.push(node)
    } else {
      const _parent = nodeMap.get(nodePId)
      let parent = _parent
      if (!parent) {
        const vnode = createNode({})
        nodeMap.set(nodePId, vnode)
        parent = vnode
      }
      parent_prop && (node[parent_prop] = parent)
      const vnodeSelf = nodeMap.get(nodeId)
      // 已经作为父元素提前缓存
      if (vnodeSelf) {
        // 值合并
        if (container_prop) {
          vnodeSelf[container_prop] = nodeValue
        } else {
          const p = node[parent_prop]
          const c = vnodeSelf[children_prop]
          Object.assign(vnodeSelf, node)
          parent_prop && (vnodeSelf[parent_prop] = p)
          vnodeSelf[children_prop] = c
        }
        parent[children_prop].push(vnodeSelf)
      } else {
        // 第一次出现 直接进行缓存
        nodeMap.set(nodeId, node)
        parent[children_prop].push(node)
      }
    }
  }

  nodeMap.clear()
  return result
}