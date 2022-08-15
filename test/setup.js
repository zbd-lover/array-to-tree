import equal from 'deep-equal'

expect.extend({
  // array-to-tree adapter.root = branch
  isInfiniteRef1 (data) {
    let pass = true

    function recur (parent) {
      if (!pass) return
      const children = parent.children
      for (let i = 0, node; i <= children.length; i++) {
        node = children[i]
        if (!node) continue
        if (node.parent !== parent) {
          pass = false
          return
        }
        recur(node)
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (!pass) break
      recur(data[i])
    }
    return {
      pass,
      message: () => 'not infinite reference',
    }
  },

  // array-to-tree adapter.root = leaf
  isInfiniteRef2 (data) {
    let pass = true

    function recur (child) {
      if (!pass) return
      const parent = child.parent
      if (!parent) return

      const children = parent.children
      const brothers = children.filter((_child) => _child !== child)

      if (brothers.length !== children.length - 1) {
        pass = false
        return
      }

      // all child nodes has same parent reference
      const parents = brothers.map((brother) => brother.parent)
      pass = parents.every((_parent) => _parent === parent)
      recur(parent)
    }

    for (let i = 0; i < data.length; i++) {
      if (!pass) break
      recur(data[i])
    }

    return {
      pass,
      message: () => 'not infinite reference',
    }
  },

  // array-to-tree adapter.root = branch
  valueCheck1 (data, {
    origin,
    idKey,
    children_prop,
    parent_prop,
    container_prop,
  }) {
    let pass = true

    const valueMap = new Map()
    origin.forEach((item) => {
      valueMap.set(item[idKey], item)
    })

    function getNodeValue (node) {
      let nodeValue
      if (container_prop) {
        nodeValue = node[container_prop]
      } else {
        nodeValue = { ...node }
        delete nodeValue[children_prop]
        parent_prop && delete nodeValue[parent_prop]
      }
      return nodeValue
    }

    function recur (nodes) {
      if (!pass) return
      for (let i = 0, children, node, nodeId, nodeValue; i < nodes.length; i++) {
        node = nodes[i]
        nodeValue = getNodeValue(node)
        nodeId = nodeValue[idKey]
        if (!valueMap.has(nodeId)) {
          pass = false
          return
        }
        if (!equal(valueMap.get(nodeId), nodeValue)) {
          pass = false
          return
        }
        valueMap.delete(nodeId)
        children = nodes[i][children_prop]
        recur(children)
      }
    }

    recur(data)

    pass = pass && valueMap.size === 0

    return {
      pass,
      message: () => 'incorrect value'
    }
  },

  // array-to-tree adapter.root = leaf
  valueCheck2 (data, {
    origin,
    idKey,
    children_prop,
    parent_prop,
    container_prop,
  }) {
    let pass = true

    const valueMap = new Map()
    origin.forEach((item) => {
      valueMap.set(item[idKey], item)
    })

    const hasAppearedMap = new Map()

    function getNodeValue (node) {
      let nodeValue
      if (container_prop) {
        nodeValue = node[container_prop]
      } else {
        nodeValue = { ...node }
        delete nodeValue[parent_prop]
        children_prop && delete nodeValue[children_prop]
      }
      return nodeValue
    }

    function recur (parent) {
      if (!pass || !parent) return
      const nodeValue = getNodeValue(parent)
      const nodeId = nodeValue[idKey]
      if (!hasAppearedMap.has(nodeId)) {
        if (!valueMap.has(nodeId)) {
          pass = false
          return
        }
        if (!equal(valueMap.get(nodeId), nodeValue)) {
          pass = false
          return
        }
        valueMap.delete(nodeId)
        hasAppearedMap.set(nodeId, true)
      }
      parent = parent[parent_prop]
      recur(parent)
    }

    for (let i = 0; i < data.length; i++) {
      recur(data[i])
    }

    pass = pass && valueMap.size === 0

    return {
      pass,
      message: () => 'incorrect value'
    }
  }
})
