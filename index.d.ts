export declare interface AdapterA2T {
  /** */
  id?: string  
  /** */
  parent_id?: string
  /** */
  parent_prop?: string,
  /** */
  children_prop?: string,
  /** */
  container_prop?: string
  /** */
  root?: 'branch' | 'leaf'
}

declare interface OptionA2T extends AdapterA2T {
  /** */
  strict?: boolean
} 

declare interface ArrayToTree {
  (): void
}

declare const arrayToTree: ArrayToTree

export default arrayToTree

export declare interface AdapterT2A {
  /** */
  id?: string  
  /** */
  parent_prop?: string,
  /** */
  children_prop?: string,
  /** */
  container_prop?: string
  /** */
  root?: 'branch' | 'leaf'
}

declare interface OptionT2A extends AdapterT2A {
  strict?: boolean
} 

declare interface TreeToArray {
  (): void
}

declare const treeToArray: TreeToArray