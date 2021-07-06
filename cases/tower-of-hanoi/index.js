
const A = ' A 柱'
const B = ' B 柱'
const C = ' C 柱'

function move(orderNumber, from, to) {
  console.log(`把第 ${orderNumber} 层圆盘，从${from}移至${to}`)
}

function hanoi(n, from, to, helper) {
  if (n > 0) {
    // 第一步
    hanoi(n - 1, from, helper, to)
    // 第二步
    move(n, from, to)
    // 第三步
    hanoi(n - 1, helper, to, from)
  }
}

hanoi(4, A, C, B)