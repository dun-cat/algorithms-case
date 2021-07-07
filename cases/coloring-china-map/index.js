
const { readFile, writeFile } = require('../../utils/file')
const { xmlParser, obj2xml } = require('../../helper')

const originalData = {
  '北京': ['河北', '天津'],
  '天津': ['北京', '河北'],
  '河北': ['北京', '天津', '山东', '河南', '山西', '内蒙古', '辽宁'],
  '山西': ['内蒙古', '陕西', '河南', '河北', '北京'],
  '陕西': ['山西', '河南', '湖北', '重庆', '四川', '甘肃', '宁夏', '内蒙古'],
  '内蒙古': ['黑龙江', '吉林', '辽宁', '河北', '山西', '宁夏', '甘肃', '陕西'],
  '河南': ['河北', '湖北', '陕西', '安徽', '山西', '山东'],
  '黑龙江': ['内蒙古', '吉林'],
  '吉林': ['内蒙古', '辽宁', '黑龙江'],
  '辽宁': ['内蒙古', '吉林', '河北'],
  '山东': ['河北', '河南', '江苏', '安徽'],
  '宁夏': ['陕西', '内蒙古', '甘肃'],
  '甘肃': ['陕西', '新疆', '青海', '四川', '宁夏', '内蒙古'],
  '青海': ['西藏', '新疆', '甘肃', '四川'],
  '西藏': ['新疆', '青海', '四川', '云南'],
  '新疆': ['西藏', '甘肃', '青海'],
  '云南': ['西藏', '四川', '贵州', '广西'],
  '湖北': ['陕西', '河南', '安徽', '江西', '湖南', '重庆'],
  '重庆': ['陕西', '贵州', '湖北', '湖南', '四川'],
  '四川': ['重庆', '陕西', '青海', '甘肃', '云南', '贵州', '西藏'],
  '上海': ['浙江', '江苏'],
  '广东': ['福建', '江西', '湖南', '广西', '海南', '澳门', '香港'],
  '广西': ['广东', '海南', '贵州', '云南'],
  '安徽': ['浙江', '江西', '河南', '山东', '江苏', '湖北'],
  '贵州': ['湖南', '广西', '四川', '重庆', '云南'],
  '海南': ['广东'],
  '湖南': ['江西', '重庆', '贵州', '广东', '广西', '湖北'],
  '江苏': ['山东', '河南', '安徽', '浙江', '上海'],
  '江西': ['浙江', '福建', '安徽', '湖北', '湖南', '广东'],
  '浙江': ['江西', '上海', '江苏', '福建', '安徽'],
  '福建': ['浙江', '江西', '广东'],
  '台湾': ['福建'],
  '澳门': ['广东'],
  '香港': ['广东']
}

const order = {
  '黑龙江': 0, '吉林': 1, '辽宁': 2, '北京': 3, '天津': 4, '河北': 5, '山西': 6, '山东': 7, '河南': 8, '安徽': 9, '浙江': 10,
  '上海': 11, '福建': 12, '台湾': 13, '香港': 14, '湖北': 15, '江西': 16, '内蒙古': 17, '宁夏': 18, '陕西': 19, '甘肃': 20,
  '新疆': 21, '西藏': 22, '青海': 23, '重庆': 24, '贵州': 25, '广西': 26, '广东': 27, '澳门': 28, '海南': 29, '云南': 30,
  '四川': 31, '湖南': 32, '江苏': 33,
}

// 不重复的颜色
const fillColors = ['#ff5722', '#03a9f4', '#e91e63', '#00bcd4', '#4caf50', '#ffc107']

class Graph {
  constructor(numVertices, adjLists) {
    this.numVertices = numVertices
    this.adjLists = adjLists
  }
};

class GraphVertix {
  constructor(index, name) {
    this.index = index
    this.data = name
  }
}

function createGraph() {

  const names = Object.keys(originalData)
  const adjacencyList = new Array(names.length)

  // 创建顶点
  const mapping = {}
  const vertices = names.map((name, index) => {
    return mapping[name] = new GraphVertix(order[name], name)
  })

  // 创建边
  vertices.forEach(v => {
    const edges = []
    const list = originalData[v.data]
    list.forEach(name => edges.push(mapping[name]))
    adjacencyList[v.index] = edges;
  })
  return new Graph(names.length, adjacencyList)
}

// 创建存储结构为邻接表的图
const graph = createGraph()

function greedyColor() {
  function firstAvailable(used_neighbour_colors) {
    const colorSet = new Set(used_neighbour_colors)
    let count = 0
    while (true) {
      if (!colorSet.has(count)) {
        return count
      }
      count++
    }
  }

  // key = 顶点，value = color index
  const color = {}
  // 遍历
  graph.adjLists.forEach((list, index) => {

    // 获取相邻顶点已使用的颜色
    const usedColors = []
    list.forEach((v) => {
      if (typeof color[v.index] !== 'undefined') {
        usedColors.push(color[v.index])
      }
    })
    // 查找一种未使用的的颜色
    color[index] = firstAvailable(usedColors)
  })

  return color
}

// 染色结果
const color = greedyColor()


function generate(inputFileName, outFileName, groupPath, fillPath) {
  // 生成 svg 格式的 模型图片图片
  const content = readFile(`${__dirname}/${inputFileName}.svg`).toString()
  xmlParser(content).then(xmlobj => {
    const vertices = groupPath.split('.').reduce((result, key) => result[key], xmlobj)

    vertices.forEach((v, index) => {
      const colorIndex = color[index]
      const target = fillPath.split('.').reduce((result, key) => result[key], v)
      target.fill = fillColors[colorIndex]
    })
    writeFile(`${__dirname}/output/${outFileName}.svg`, obj2xml(xmlobj))
  })
}

// reOrderMap('uncolor-map')

// 生成模型
generate('uncolor-model', 'colored-model', 'svg.g.0.ellipse', '$')
// 生成地图
generate('uncolor-map', 'colored-map', 'svg.path', '$')


/* -------------------- 帮助函数 -----------------------*/

// 因为地图的行政区和模型顶点的序列不一致，所以我们这边同步他们的序列，使他们保持一致性。
function reOrderMap(inputFileName) {
  const content = readFile(`${__dirname}/${inputFileName}.svg`).toString()
  xmlParser(content).then(xmlobj => {
    const texts = 'svg.text'.split('.').reduce((result, key) => result[key], xmlobj)
    const paths = 'svg.path'.split('.').reduce((result, key) => result[key], xmlobj)
    let newPaths = new Array(paths.length)
    texts.forEach((v, index) => {
      const t = 'tspan.0._'.split('.').reduce((result, key) => result[key], v)
      newPaths[order[t]] = paths[index]
    })
    xmlobj.svg.path = newPaths
    writeFile(`${__dirname}/reordered-uncolor-map.svg`, obj2xml(xmlobj))
  })
}

