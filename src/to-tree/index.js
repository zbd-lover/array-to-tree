import kindOf from 'kind-of'
import isPlainObject from 'is-plain-obj'
import convert1 from './convert1'
import convert2 from './convert2'

export default function arrayToTree (data, adapter = {}) {
  if (kindOf(data) !== 'array') {
    return []
  }

  const errors = validateAdapter(adapter)
  if (errors.length > 0) {
    const msg = `The 'adapter' is invalid, causes: \n ${errors.join('\n')}`
    throw new Error(msg)
  }

  const { root = 'branch' } = adapter

  return root === 'branch'
    ? convert1(data, adapter)
    : convert2(data, adapter)
}

function validateAdapter (adapter) {
  const errors = []

  if (!isPlainObject(adapter)) {
    errors.push(
      `Expected 'adapter' as a plain object, instead of ${kindOf(adapter)} `
    )
  }

  const { root, id, parent_id, parent_prop, children_prop, container_prop } =
    adapter

  if (root && root !== 'branch' && root !== 'leaf') {
    errors.push(
      `Expected 'adapter.root' must be 'branch' or 'leaf', instead of ${root}`
    )
  }

  if (id && parent_id && id === parent_id) {
    errors.push('The \'adapter.id\' equals with \'adapter.parent_id\'.')
  }

  const k1 = kindOf(id)
  if (id && k1 !== 'string') {
    errors.push(
      `Expected 'adapter.id' as a not empty string, instead of ${id}.`
    )
  }

  const k2 = kindOf(parent_id)
  if (parent_id && k2 !== 'string') {
    errors.push(
      `Expected 'adapter.parent_id' as a not empty string, instead of ${parent_id}.`
    )
  }

  const k3 = kindOf(parent_prop)
  if (parent_prop && k3 !== 'string') {
    errors.push(
      `Expected 'adapter.parent_prop' as a not empty string, instead of ${parent_prop}.`
    )
  }

  const k4 = kindOf(children_prop)
  if (children_prop && k4 !== 'string') {
    errors.push(
      `Expected 'adapter.children_prop' as a not empty string, instead of ${children_prop}.`
    )
  }

  const k5 = kindOf(container_prop)
  if (container_prop && k5 !== 'string') {
    errors.push(
      `Expected 'adapter.container_prop' as a not empty string, instead of ${container_prop}.`
    )
  }

  return errors
}
