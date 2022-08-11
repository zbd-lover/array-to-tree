/** whether v is among (null, undefined, '') */
export default function isNull(v) {
  return v === null || v === undefined || v === ''
}