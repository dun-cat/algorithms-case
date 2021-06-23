const SVGGenerator = require('./svg-generator');
const { Element, Node } = SVGGenerator


function exportToSVG(data, size) {
  const blockWidth = 10
  const columns = 12
  const spacing = 5
  const svgGenerator = new SVGGenerator()

  let x = 0, y = 0, count = 0
  let groups = []
  data.forEach((item, index) => {
    const group = getGroupItem(item, size, blockWidth)
    group.value.attr({ transform: `translate(${x} ${y})` })
    groups.push(group)
    if ((index + 1) % columns === 0) {
      count++
      x = 0
      y += group.value.attributes.height + spacing
    } else {
      x += group.value.attributes.width + spacing
    }
  })

  svgGenerator.createLayout(columns * ((blockWidth * size) + spacing), (count + 1) * ((blockWidth * size) + spacing))
  svgGenerator.setChilds(groups)
  svgGenerator.export('n-queens')
}

function getGroupItem(data, size, blockWidth) {
  const blockHeight = blockWidth;
  const width = size * blockWidth
  const height = size * blockHeight
  const group = new Node(new Element('g').attr({ width, height }))

  const rows = new Array(size).fill('')
  const table = rows.map(row => new Array(size).fill(''))
  data.forEach((row, column) => {
    table[row][column] = 'O'
  });

  const queens = []
  table.forEach((rows, rowIndex) => {
    rows.forEach((value, columnIndex) => {
      const block = new Element('rect').attr({
        x: rowIndex * blockWidth,
        y: columnIndex * blockHeight,
        width: blockWidth,
        height: blockHeight,
        fill: (columnIndex + rowIndex) % 2 !== 0 ? 'black' : 'white'
      })
      // 皇后
      if (value === 'O') {
        const r = blockWidth / 2
        const queen = new Element('circle').attr({
          r: r - 2,
          cx: rowIndex * blockWidth + r,
          cy: columnIndex * blockHeight + r,
          fill: '#00bcd4'
        })
        queens.push(new Node(queen))
      }
      group.appendChild(new Node(block))
    })
  })
  queens.forEach(n => group.appendChild(n))
  group.appendPath([[0, 0], [width, 0], [width, height], [0, height], [0, 0]])
  return group
}


module.exports = {
  exportToSVG
}