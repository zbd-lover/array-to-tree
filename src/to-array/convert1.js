/** Flatten nodes, the first-element as the topest branch node. */
export default function convert1(data, adapter) {
  const { parent_prop, children_prop = 'children', container_prop } = adapter

  const result = []

  function recur(nodes) {
    for (let i = 0, node, nodeValue, children; i < nodes.length; i++) {
      node = nodes[i]
      nodeValue = container_prop ? node[container_prop] : node
      children = node[children_prop] || []
      if (!container_prop) {
        delete nodeValue[children_prop]
        parent_prop && delete nodeValue[parent_prop]
      }
      result.push(nodeValue)
      recur(children)
    }
  }

  recur(data)
  return result
}
