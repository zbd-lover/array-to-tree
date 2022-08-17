# 简介
快速的将数组结构数据转为树结构数据，及其逆向操作。
# 安装
`npm install arr-to-tree --save`
# 使用
```javascript
import arrayToTree from 'arr-to-tree'

const data1 = [
  {
    id: 1,
    name: '结点1',
    parent_id: undefined
  },
  {
    id: 2,
    name: '结点2',
    parent_id: 1
  },
  {
    id: 3,
    name: '结点3',
    parent_id: 2
  },
  {
    id: 4,
    name: '结点4',
    parent_id: null
  }
]
arrayToTree(data1)

/*
 * 输出：

 * 结点1
 *   结点2
 *     结点3
 * 结点4
 */

const data2 = [
  {
    _id: '1',
    name: '结点1',
    parent: null
  },
  {
    _id: '2',
    name: '结点2',
    parent: '1'
  },
  {
    _id: '3',
    name: '结点3',
    parent: '2'
  },
  {
    _id: '4',
    name: '结点4',
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
 * 输出：

 * 结点1
 *   结点2
 *     结点3
 * 结点4
 * 
 * 说明1: 每个结点都有'myParent'这个属性来指向它的父结点
 * 说明2: 每个结点都有'myChildren'这个属性来指向它所有的孩子结点
 * 说明3: 转换结果中第一层中的每个元素都是树中的顶级分支结点
 */

const data3 = [
  {
    id: 1,
    name: '结点1',
    parent_id: undefined
  },
  {
    id: 2,
    name: '结点2',
    parent_id: 1
  },
  {
    id: 3,
    name: '结点3',
    parent_id: 2
  },
  {
    id: 4,
    name: '结点4',
    parent_id: null
  }
]

arrayToTree(data3, {
  parent_prop: 'myParent',
  root: 'leaf'
})

/*
 * 输出
 *       null
 *     结点1
 *   结点2
 * 结点3
 *   null
 * 结点4
 * 
 * 说明1: 转换结果中第一层中的每个元素都是树的叶子结点
 * 说明2: 每个结点都有'myParent'这个属性来指向它的父结点
 */

```
# 备注
**本库提供的所有函数都具有副作用，它们会改变原始数据，如果要避免此行为，请使用类似`deepClone`的函数。**
# 库提供的函数
`arrayToTree<S = any>(data: any[], option?: OptionA2T): S[]`
```typescript
interface OptionA2T {
  /** 使用数组元素中的哪个属性来标识结点，默认值为'id'。 */
  id?: string  
  /** 使用数组元素中的哪个属性来标识父结点，默认值为'parent_id'。 */
  parent_id?: string
  /** 给结点增加一个指向其父结点的属性。如果root为'leaf'，则默认为'parent'。 */
  parent_prop?: string,
  /** 给结点增加一个指向其所有子结点的属性。如果root为'branch'，则默认为'children'。 */
  children_prop?: string,
  /** 给结点增加一个指向其值的属性（表明结点关系的属性和其他属性将不在同一级）。 */
  container_prop?: string,
  /**
   * 该值说明了最终结果的树的结构是如何体现的，可能的值：'branch', 'leaf', 默认值为'branch'。
   * 该值决定了结果中第一层元素是树的顶级分支结点还是叶子结点。
   * */
  root?: 'branch' | 'leaf',
  /**
   * 如果为true，转换函数将会更加严格地执行，默认为false。其会在这遇到这几种情况时抛出错误：
   * 1. 一个结点的标识（id）重复出现多次
   * 2. 结点拥有未知的父结点>
   * 3. 结点的标识和其某个祖先结点标识一致
   *  */
  strict?: boolean
}
```
`treeToArray<S = any>(data: any[], option?: OptionT2A): S[]`
```typescript
interface OptionT2A {
  /**
   * 当root为'leaf'时，此属性有用，说明结点的哪个属性是用来标识其唯一性的
   * */
  id?: string  
  /** 结点哪个属性指向其父结点（这个属性将会被删掉）。 */
  parent_prop?: string,
  /** 结点哪个属性指向其所有子结点（这个属性将会被删掉）。 */
  children_prop?: string,
  /** 结点哪个属性是指向其值的属性（这个属性将会被删掉）。 */
  container_prop?: string
  /**
   * 该值说明了作为数据源的树，它的结构是如何体现的（影响对这颗树的遍历的方式），可能的值：'branch', 'leaf', 默认值为'branch'
   * 决定了数据源中这棵树的起点是顶级分支结点还是叶子结点（底部遍历至顶部，或者相反）
   * */
  root?: 'branch' | 'leaf'
}
```