import fs from 'fs'
import arrayToTree1 from '../../src/to-tree/index'
import arrayToTree2 from 'smart-arraytotree'
import pkg from 'performant-array-to-tree'
const { arrayToTree: arrayToTree3} = pkg

const test = async () => {
  const _test = (data) => {
    const d1 = JSON.parse(JSON.stringify(data))
    const d2 = JSON.parse(JSON.stringify(data))
    const d3 = JSON.parse(JSON.stringify(data))
    const d4 = JSON.parse(JSON.stringify(data))
    const t1 = () => {
      console.time('convert1(current, root = \'branch\')')
      const res = arrayToTree1(d1, {
        id: 'regionId',
        parent_id: 'parentId',
      })
      console.timeEnd('convert1(current, root = \'branch\')')
      return res
    }
    const t2 = () => {
      console.time('convert2(current, root = \'leaf\')')
      const res = arrayToTree1(d2, {
        id: 'regionId',
        parent_id: 'parentId',
        root: 'leaf',
      })
      console.timeEnd('convert2(current, root = \'leaf\')')
      return res
    }
    const t3 = () => {
      console.time('convert2')
      const res = arrayToTree2(d3, { id:'regionId', pid:'parentId', firstPid:null })
      console.timeEnd('convert2')
      return res
    }
    const t4 = () => {
      console.time('convert3')
      const res = arrayToTree3(d4, {
        id: 'regionId',
        parentId: 'parentId',
        dataField: null
      })
      console.timeEnd('convert3')
      return res
    }
    return [t1(), t2(), t3(), t4()]
  }

  fs.readFile(
    './test/__time__/datasource.json',
    { encoding: 'utf-8' },
    (err, data) => {
      if (err) {
        console.log(err, 'read test data failed.')
      } else {
        const d = JSON.parse(data)
        const nodes = _test(d)
        nodes.forEach((node, index) => {
          fs.writeFile(
            `./test/__time__/result/${index + 1}.json`,
            JSON.stringify(node),
            {},
            () => null
          )
        })
      }
    }
  )
}

test()
