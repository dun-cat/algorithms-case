const fs = require('fs')
const path = require('path')

function writeFile(filePath, content) {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  fs.writeFile(filePath, content, (err) => {
    if (err) throw err;
  })
}

function readFile(filePath) {
  if (!fs.existsSync(path.dirname(filePath))) {
    return null
  }
  return fs.readFileSync(filePath)
}

module.exports = {
  writeFile, readFile
}