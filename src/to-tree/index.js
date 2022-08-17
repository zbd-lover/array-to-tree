import kindOf from 'kind-of'
import isPlainObject from 'is-plain-obj'
import convert1 from './convert1'
import convert2 from './convert2'
import isNothing from '../util/is-nothing'

export default function arrayToTree (data, adapter = {}) {
  if (kindOf(data) !== 'array') {
    return []
  }

  const errors = validateAdapter(adapter)
  if (errors.length > 0) {
    const msg = `The 'adapter' is invalid, causes: \n ${errors.join('\n')}`
    throw new Error(msg)
  }

  const { strict = false, ...rest } = adapter
  if (strict) {
    const {
      detail,
      errorKinds
    } = catchErrors(data, {
      id: adapter.id,
      parent_id: adapter.parent_id
    })
    if (detail.length > 0) {
      console.log('Inregular data causes: \n', detail)
      throw new Error('The data isn\'t regular, causes: ' + errorKinds.join(', '))
    }
  }

  const { root = 'branch' } = adapter

  return root === 'branch'
    ? convert1(data, rest)
    : convert2(data, rest)
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

function catchErrors (data, adapter = {}) {
  const DUPLICATED_ID_ERROR = 'duplicated id'
  const UNKNOWN_PARENT_ID_ERROR = 'unknown parent_id'
  const INFINITE_REF_ERROR = 'self.id equals oneself ancestor.id'
  const nodeMap = new Map()
  const errorLogMap = new Map()
  const parentIdMap = new Map()

  const { id: idKey = 'id', parent_id: parentIdKey = 'parent_id' } = adapter

  const errorKindMap = new Map()
  errorKindMap.set(DUPLICATED_ID_ERROR, false)
  errorKindMap.set(UNKNOWN_PARENT_ID_ERROR, false)
  errorKindMap.set(INFINITE_REF_ERROR, false)

  function addError (node, error) {
    errorKindMap.set(error, true)
    const id = node[idKey]
    if (errorLogMap.has(id)) {
      errorLogMap.get(id).errors.push(error)
    } else {
      errorLogMap.set(id, {
        node,
        errors: [error],
      })
    }
  }

  for (let i = 0, el, id, parent_id; i < data.length; i++) {
    el = data[i]
    id = el[idKey]
    parent_id = el[parentIdKey]
    if (nodeMap.has(id)) {
      addError(el, DUPLICATED_ID_ERROR)
    } else {
      nodeMap.set(id, el)
      parentIdMap.set(id, parent_id)
    }
  }

  for (let [selfId, parentId] of parentIdMap.entries()) {
    if (!isNothing(parentId)) {
      if (!nodeMap.has(parentId)) {
        addError(nodeMap.get(selfId), UNKNOWN_PARENT_ID_ERROR)
      }

      function recur (ancestorId) {
        if (isNothing(ancestorId)) return
        if (selfId === ancestorId) {
          addError(nodeMap.get(selfId), INFINITE_REF_ERROR)
        } else {
          recur(parentIdMap.get(ancestorId))
        }
      }
      recur(parentId)
    }

  }

  const errors = []
  for (let [, error] of errorLogMap.entries()) {
    errors.push(error)
  }

  const errorKinds = []

  for (let [kind, flag] of errorKindMap.entries()) {
    if (flag) errorKinds.push(kind)
  }

  nodeMap.clear()
  errorLogMap.clear()
  parentIdMap.clear()
  errorKindMap.clear()

  return {
    detail: errors,
    errorKinds
  }
}