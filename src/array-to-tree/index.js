import kindOf from 'kind-of'
import isPlainObject from 'is-plain-obj'
import transform1 from "./transform1"
import transform2 from "./transfrom2"
import isNothing from '../util/is-nothing'

export default function arrayToTree(data, adapter = {}) {
  const errors = validateAdapter(adapter)
  if (errors.length > 0) {
    const msg = `The 'adapter' is invalid, causes: \n ${errors.join('\n')}`
    throw new Error(msg)
  }

  const { children_prop = 'children', parent_prop } = adapter
  if (children_prop) {
    return transform1(data, adapter)
  } else if (parent_prop) {
    return transform2(data, adapter)
  } else {
    return data
  }
}

function validateAdapter(adapter) {
  const errors = []

  if (!isPlainObject(adapter)) {
    errors.push(`Expected 'adapter' as a plain object, instead of ${kindOf(adapter)} `)
  }

  const {
    id,
    parent_id,
    parent_prop,
    children_prop,
    container_prop,
    is_sub_tree = (v) => isNothing(v[parent_id]),
  } = adapter

  if (id && parent_id && id === parent_id) {
    errors.push(`The 'adapter.id' equals with 'adapter.parent_id'.`)
  }

  const k1 = kindOf(id)
  if (id && k1 !== 'string') {
    errors.push(`Expected 'adapter.id' as a not empty string, instead of ${id}.`)
  }

  const k2 = kindOf(parent_id)
  if (parent_id && k2 !== 'string') {
    errors.push(`Expected 'adapter.parent_id' as a not empty string, instead of ${parent_id}.`)
  }

  const k3 = kindOf(parent_prop)
  if (parent_prop && k3 !== 'string') {
    errors.push(`Expected 'adapter.parent_prop' as a not empty string, instead of ${parent_prop}.`)
  }

  const k4 = kindOf(children_prop)
  if (children_prop && k4 !== 'string') {
    errors.push(`Expected 'adapter.children_prop' as a not empty string, instead of ${children_prop}.`)
  }

  const k5 = kindOf(container_prop)
  if (container_prop && k5 !== 'string') {
    errors.push(`Expected 'adapter.container_prop' as a not empty string, instead of ${container_prop}.`)
  }

  if (children_prop) {
    const k6 = kindOf(is_sub_tree)
    if (is_sub_tree && k6 !== 'function') {
      errors.push(`Expected 'adapter.is_sub_tree' as a not empty string, instead of ${container_prop}.`)
    }
  }

  return errors
}