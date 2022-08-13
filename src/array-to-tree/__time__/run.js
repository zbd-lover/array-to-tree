import fs from 'fs'
import transform1 from '../transform1.js'

const test = async () => {
  const _test = (data) => {
    console.time('transform')
    const res = transform1(data, {
      id: 'regionId',
      parent_id: 'parentId',
    })
    console.timeEnd('transform')
    return res
  }

  const genFilename = (i) => `./src/array-to-tree/__time__/result/${i}.json`

  fs.readFile('./src/array-to-tree/__time__/datasource.json', { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      console.log(err, 'read test data failed.')
    } else {
      const res = []
      const d = JSON.parse(data)
      res.push(_test(d))
      res.forEach((data, index) => {
        fs.writeFile(genFilename(index + 1), JSON.stringify(data), {}, () => null)
      })
    }
  })
}

test()