/** Flatten nodes, the first-element as leaf node. */
export default function convert2 (data, adapter) {
  const {
    id = 'id',
    parent_prop = 'parent',
    children_prop,
    container_prop,
  } = adapter

  const result = []
  const collected = new Map()

  function recur (node) {
    const nodeValue = { ...(container_prop ? node[container_prop] : node) }
    const nodeId = nodeValue[id]
    if (collected.has(nodeId)) return
    const parent = node[parent_prop]
    if (!container_prop) {
      delete nodeValue[parent_prop]
      children_prop && delete nodeValue[children_prop]
    }
    collected.set(nodeId, 1)
    result.push(nodeValue)
    parent && recur(parent)
  }

  for (let i = 0; i < data.length; i++) {
    recur(data[i])
  }

  collected.clear()
  return result
}
