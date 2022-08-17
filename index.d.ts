export declare interface OptionA2T {
  /** Define a property that can differentiate each node, by default 'id'. */
  id?: string  
  /** Define a property that can differentiate node's parent, by default 'parent_id'. */
  parent_id?: string
  /** Define a property of node that refers to its parent, by default 'parent' if 'root' as 'leaf'. */
  parent_prop?: string,
  /** Define a property of node that refers to its children by default 'children' if 'root' as 'branch'. */
  children_prop?: string,
  /** Define a property of node that wrap the its value. */
  container_prop?: string,
  /**
   * How to reflect the structure of the tree? choose 'branch' or 'leaf' as 'root' (way to iterate tree).
   * Determines whether node in result as the topest branch node or leaf node.
   * By default 'branch'.
   * */
  root?: 'branch' | 'leaf',
  /**
   * Function will be called more strictly, by default false. It will throw error in follwing cases: <br/>
   * 1. dulipcated node.id <br/>
   * 2. unkonwn parent.id <br/>
   * 3. self.id equals certain ancestor.id
   *  */
  strict?: boolean
}

declare interface ArrayToTree {
  <S = any>(data: any[], option?: OptionA2T): S[]
}

declare const arrayToTree: ArrayToTree

export default arrayToTree

export declare interface OptionT2A {
  /**
   * Define a property that can differentiate each node, by default 'id'.
   * It's necessary, when 'root' is 'leaf'.
   * */
  id?: string  
  /** Does what propery of node refer to its' parent? */
  parent_prop?: string,
  /** Does what propery of node refer to its' children? */
  children_prop?: string,
  /** Does what propery of node wrap its' value? */
  container_prop?: string
  /**
   * How to reflect the structure of the tree? choose 'branch' or 'leaf' as 'root' (way to iterate tree).
   * Determines whether node in datasource as the topest branch node or leaf node.
   * By default 'branch'.
   * */
  root?: 'branch' | 'leaf'
}

declare interface TreeToArray {
  <S = any>(data: any, option?: OptionT2A): S[]
}

export declare const treeToArray: TreeToArray