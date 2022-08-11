import isNothing from "../util/is-nothing"

/** 转换器1，每个结点含有对子结点的引用时，返回所有的顶级分支结点 */
export default function transform1(data, adapter) {
  const result = []
  const map = new Map()

  const {
    id = 'id',
    parent_id = 'parent_id',
    children_prop = 'children',
    parent_prop,
    container_prop,
    is_sub_tree = (v) => isNothing(v[parent_id]),
  } = adapter

  function createNode(value) {
    let node = {}
    if (container_prop) {
      node[container_prop] = value
    } else {
      node = value
    }
    node[children_prop] = []
    if (parent_prop) {
      node[parent_prop] = null
    }
    return node
  }

  for (let i = 0, node, nodeId, nodePId, nodValue; i < data.length; i++) {
    node = createNode(data[i])
    nodeId = data[i][id]
    nodePId = data[i][parent_id]
    nodValue = data[i]

    // 是顶级分支结点
    if (is_sub_tree(nodValue)) {
      map.set(nodeId, node)
      result.push(node)
    } else {
      const _parent = map.get(nodePId)
      let parent = _parent
      if (!parent) {
        const vnode = createNode({})
        map.set(nodePId, vnode)
        parent = vnode
      }
      if (parent_prop) {
        node[parent_prop] = parent
      }

      const vnodeSelf = map.get(nodeId)
      // 已经作为父元素提前缓存
      if (vnodeSelf) {
        // 值合并
        if (container_prop) {
          vnodeSelf[container_prop] = nodValue
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
        map.set(nodeId, node)
        parent[children_prop].push(node)
      }
    }
  }

  return result
}