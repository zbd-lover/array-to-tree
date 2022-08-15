/** whether v is among (null, undefined, '') */
export default function isNothing (v) {
  return v === null || v === undefined || v === ''
}