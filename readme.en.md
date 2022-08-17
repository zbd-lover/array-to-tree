# Profile
Convert array to tree fastly, and opposite.
# Installation
`npm install arr-to-tree --save`
# Usage
```javascript
import arrayToTree from 'arr-to-tree'

const data1 = [
  {
    id: 1,
    name: 'Node1',
    parent_id: undefined
  },
  {
    id: 2,
    name: 'Node2',
    parent_id: 1
  },
  {
    id: 3,
    name: 'Node3',
    parent_id: 2
  },
  {
    id: 4,
    name: 'Node4',
    parent_id: null
  }
]
arrayToTree(data1)

/*
 * Output:

 * Node1
 *   Node2
 *     Node3
 * Node4
 */

const data2 = [
  {
    _id: '1',
    name: 'Node1',
    parent: null
  },
  {
    _id: '2',
    name: 'Node2',
    parent: '1'
  },
  {
    _id: '3',
    name: 'Node3',
    parent: '2'
  },
  {
    _id: '4',
    name: 'Node4',
    parent: null
  }
]
 
arrayToTree(data2, {
  id: '_id',
  parent_id: 'parent',
  children_prop: 'myChildren',
  parent_prop: 'myParent',
  root: 'branch'
})

/*
 * Output 

 * Node1
 *   Node2
 *     Node3
 * Node4
 * 
 * Note1: each node own 'myChildren' property that refers to its children
 * Note2: each node own 'myParent' property that refers to its parent
 * Note3: each first-level node as the topest branch node in tree
 */

const data3 = [
  {
    id: 1,
    name: 'Node1',
    parent_id: undefined
  },
  {
    id: 2,
    name: 'Node2',
    parent_id: 1
  },
  {
    id: 3,
    name: 'Node3',
    parent_id: 2
  },
  {
    id: 4,
    name: 'Node4',
    parent_id: null
  }
]

arrayToTree(data3, {
  parent_prop: 'myParent',
  root: 'leaf'
})

/*
 * Output
 *       null
 *     Node1
 *   Node2
 * Node3
 *   null
 * Node4
 * 
 * Note1: each first-level node as the leaf node in tree
 * Note3: each node own 'myParent' property that refers to its parent
 */

```
# Note
**Each function provided by the lib makes sideEffect, the origin data will be changed. We can use function like 'deepClone' to avoid it.**
# API
`arrayToTree<S = any>(data: any[], option?: OptionA2T): S[]`
```typescript
interface OptionA2T {
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
```
`treeToArray<S = any>(data: any[], option?: OptionT2A): S[]`
```typescript
interface OptionT2A {
  /**
   * Define a property that can differentiate each node, by default 'id'.
   * It's necessary, when 'root' is 'leaf'.
   * */
  id?: string  
  /** Does what propery of node refer to its' parent? （this property will be deleted） */
  parent_prop?: string,
  /** Does what propery of node refer to its' children? this property will be deleted）*/
  children_prop?: string,
  /** Does what propery of node wrap its' value? this property will be deleted）*/
  container_prop?: string
  /**
   * How to reflect the structure of the tree? choose 'branch' or 'leaf' as 'root' (way to iterate tree).
   * Determines whether starting point of tree is the topest branch node or leaf node.
   * By default 'branch'.
   * */
  root?: 'branch' | 'leaf'
}
```