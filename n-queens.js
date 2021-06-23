
const { exportToSVG } = require('./helper')

function calcQueens(size) {
  const output = [];
  subquestion(new Array(size).fill(-1), 0, size, output)
  if (output.length === 0) {
    console.log('无解！')
  } else {
    console.log(`一共有${output.length}种解法`)
  }
}

function subquestion(board, currentColumn, size, output) {

  // 结束
  if (currentColumn === size) {
    output.push(JSON.parse(JSON.stringify(board)))
    return
  }

  // 遍历当前列的每一行，检测每一行是否与前面的皇后位置冲突
  for (let i = 0; i < size; i++) {
    // 存储皇后位置
    board[currentColumn] = i

    // 检测当前列是否冲突
    if (noConflicts(board, currentColumn)) {
      // 继续下一列的遍历
      let done = subquestion(board, currentColumn + 1, size, output)
      if (done) return true
    }
  }

  return false
}

function noConflicts(board, currentColumn) {
  // 皇后的位置信息，查看每个皇后是否与
  for (let i = 0; i < currentColumn; i++) {

    // 首先检测【皇后的位置】是否和【当前列皇后位置】同行。若同行，则冲突
    if (board[i] === board[currentColumn]) return false

    // 其次，如果【当前列皇后位置】和【遍历的皇后位置】纵横差相等，则冲突
    if (currentColumn - i === Math.abs(board[currentColumn] - board[i])) return false

  }
  return true
}

calcQueens(16)