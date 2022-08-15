import kindOf from 'kind-of'
import isPlainObject from 'is-plain-obj'

export default function ensureSafe (data, adapter = {}) {
  if (kindOf(data) !== 'array') {
    return false
  }
  if (!isPlainObject(adapter)) {
    return false
  }

  return true
}