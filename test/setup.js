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
  },

  // tree-to-array adpater.root = branch
  valueCheck3 (data, {
    // tree
    origin,
    idKey,
    children_prop,
    parent_prop,
    container_prop
  }) {
    function findNode (nodes, id) {
      for (let i = 0, node, nodeId, nodeValue; i < nodes.length; i++) {
        node = nodes[i]
        nodeValue = getNodeValue(node)
        nodeId = nodeValue[idKey]
        if (id === nodeId) {
          return node
        }
        const result = findNode(node[children_prop], id)
        if (result) return result
      }
    }

    function getNodesCount () {
      let count = 0

      function addCount (node) {
        const children = node[children_prop] || []
        count += children.length
        for (let i = 0; i < children.length; i++) {
          addCount(children[i])
        }
      }

      const root = {}
      root[children_prop] = origin

      addCount(root)

      return count
    }

    function getNodeValue (node) {
      let nodeValue
      if (container_prop) {
        nodeValue = node[container_prop]
      } else {
        nodeValue = { ...node }
        children_prop && delete nodeValue[children_prop]
        parent_prop && delete nodeValue[parent_prop]
      }
      return nodeValue
    }

    let pass = true

    for (let i = 0, el, node, nodeValue; i < data.length; i++) {
      el = data[i]
      node = findNode(origin, el[idKey])
      nodeValue = getNodeValue(node)
      if (!equal(nodeValue, el)) {
        pass = false
        break
      }
    }

    pass = pass && data.length === getNodesCount()

    return {
      pass,
      message: () => 'incorrect value.'
    }
  },

  // tree-to-array adpater.root = leaf
  valueCheck4 (data, {
    // tree
    origin,
    idKey,
    children_prop,
    parent_prop,
    container_prop
  }) {

    function findNode (id) {
      const hasAppearedSet = new Set()
      function _findNode (node, id) {
        if (!node) return
        const nodeValue = getNodeValue(node)
        const nodeId = nodeValue[idKey]
        if (hasAppearedSet.has(nodeId)) {
          return
        } else {
          hasAppearedSet.add(nodeId)
          if (nodeId === id) {
            return node
          }
          const maybe = _findNode(node[parent_prop], id)
          if (maybe) return maybe
        }
      }

      for (let i = 0, node; i < origin.length; i++) {
        node = _findNode(origin[i], id)
        if (node) return node
      }
    }

    function getNodesCount () {
      const hasAppearedSet = new Set()

      function addCount (node) {
        if (!node) return
        const value = getNodeValue(node)
        const nodeId = value[idKey]
        hasAppearedSet.add(nodeId)

        const parent = node[parent_prop]
        parent && addCount(parent)
      }

      for (let i = 0; i < origin.length; i++) {
        addCount(origin[i])
      }

      return hasAppearedSet.size
    }

    function getNodeValue (node) {
      let nodeValue
      if (container_prop) {
        nodeValue = node[container_prop]
      } else {
        nodeValue = { ...node }
        children_prop && delete nodeValue[children_prop]
        parent_prop && delete nodeValue[parent_prop]
      }
      return nodeValue
    }

    let pass = true

    for (let i = 0, el, node, nodeId, nodeValue; i < data.length; i++) {
      el = data[i]
      nodeId = el[idKey]
      node = findNode(nodeId)
      nodeValue = getNodeValue(node)
      if (!equal(nodeValue, el)) {
        pass = false
        break
      }
    }

    pass = pass && data.length === getNodesCount()

    return {
      pass,
      message: () => 'incorrect value'
    }
  }
})