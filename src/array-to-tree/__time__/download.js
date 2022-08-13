import fs from 'fs'
import got from 'got'

const source = './src/array-to-tree/__time__/datasource.json'

/** get test data length 46086 */
async function download() {
  if (fs.existsSync(source)) {
    console.log('downloaded\n')
    return;
  }
  try {
    const data = await got.get('http://zbd329.top/static/array-to-tree-datasource.json').json()
    fs.writeFile(source, JSON.stringify(data), {
      encoding: 'utf-8'
    }, () => {
      console.log('downloaded')
    })
  } catch (error) {
    console.log('下载失败:', error.message)
  }
}

download()