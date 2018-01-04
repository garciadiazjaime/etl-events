import fs from 'fs'
import util from 'util'

const readFileAsync = util.promisify(fs.readFile);

function readFile(file) {
  return readFileAsync(file, 'utf-8')
}

export default readFile;
