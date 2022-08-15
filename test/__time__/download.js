import fs from 'fs'
import got from 'got'

const source = './test/__time__/datasource.json'

/** get test data length 46086 */
async function download () {
  if (fs.existsSync(source)) {
    console.log('downloaded.\n')
    return
  }
  try {
    const data = await got
      // mirror of
      .get('http://zbd329.top/static/array-to-tree-datasource.json')
      .json()
    fs.writeFile(
      source,
      JSON.stringify(data),
      {
        encoding: 'utf-8',
      },
      () => {
        console.log('downloaded ok.')
      }
    )
  } catch (error) {
    console.log('download failed:', error.message)
  }
}

download()
