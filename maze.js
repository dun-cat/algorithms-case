const SVGGenerator = require('./svg-generator');
const CELL_SIZE = 20
const rows = 20
const cols = 20

const layout_width = rows * CELL_SIZE
const layout_height = cols * CELL_SIZE

const svgGenerator = new SVGGenerator()
svgGenerator.createLayout({
  width: layout_width,
  height: layout_height,
  fill: "grey"
})

class Cell {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.len = size
    // top right bottom left
    this.walls = [true, true, true, true];
  }

  removeWalls(other) {
    const x = this.x - other.x;
    const y = this.y - other.y;


    function getDirection() {
      if (y > 0) return 'top'
      if (x > 0) return 'left'
      return null
    }

    switch (getDirection()) {
      case 'left':
        this.walls[3] = false
        other.walls[1] = false
        break
      case 'top':
        this.walls[0] = false
        other.walls[2] = false
        break
    }

  }

  path() {
    const x = this.x;
    const y = this.y;
    const walls = []
    if (this.walls[0]) {
      walls.push([[x, y], [x + this.len, y]])
    }
    if (this.walls[1]) {
      walls.push([[x + this.len, y], [x + this.len, y + this.len]])
    }
    if (this.walls[2]) {
      walls.push([[x, y + this.len], [x + this.len, y + this.len]])
    }
    if (this.walls[3]) {
      walls.push([[x, y + this.len], [x, y]])
    }
    return walls
  }
}

function createCells(rows, cols) {
  let x;
  let y;
  let cells = []
  for (let i = 0; i < rows; i++) {
    cells[i] = [];
    for (let j = 0; j < cols; j++) {
      x = (j * CELL_SIZE);
      y = (i * CELL_SIZE);
      cells[i].push(new Cell(x, y, CELL_SIZE));
    }
  }
  return cells
}

function binaryTreeMaze() {

  // 创建迷宫
  const mazeMatrix = createCells(rows, cols)

  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      const neighbours = []

      if (x > 0) neighbours.push([x - 1, y])
      if (y > 0) neighbours.push([x, y - 1])

      // 如果没有，继续遍历
      if (neighbours.length === 0) continue

      // 随机选一个相邻的单元格
      const tossCoin = Math.floor(Math.random() * neighbours.length)

      // 把当前单元格和选择的单元格之间的墙挖掉。
      const [x1, y1] = neighbours[tossCoin];
      mazeMatrix[x][y].removeWalls(mazeMatrix[x1][y1]);
    }
  }
  return mazeMatrix
}

function exportSVG(maze) {
  maze.forEach(rows => {
    rows.forEach(cell => {
      cell.path().forEach(wall => svgGenerator.getRoot().appendPath(wall))
    })
  });
  svgGenerator.render()
  svgGenerator.export('maze')
}

const maze = binaryTreeMaze()
exportSVG(maze)