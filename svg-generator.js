const fs = require('fs')
const path = require('path')

const singleTags = ['rect', 'circle', 'path']


class Element {
  constructor(name) {
    this.name = name
    this.attributes = {}
    this.isSingleTag = false
    if (singleTags.indexOf(name) !== -1) {
      this.isSingleTag = true
    }
  }

  attr(obj) {
    Object.assign(this.attributes, obj)
    return this
  }

  render() {
    const { isSingleTag, name } = this

    const attrStr = Object.keys(this.attributes).map(key => `${key}="${this.attributes[key]}"`).join(' ')
    let result = ''
    if (isSingleTag) {
      result = [`\<${name} ${attrStr}/>`]
    } else {
      result = [`\<${name} ${attrStr}>`, `\</${name}>`]
    }

    return result
  }
}

class Node {
  constructor(element) {
    this.parent = null
    this.childs = null
    this.value = element
  }

  appendChild(node) {
    if (!this.childs) this.childs = []
    this.childs.push(node)
  }

  appendPath(data) {
    const svgPath = new Element('path').attr({
      d: data.map((coordinate, index) => {
        let xy = ''
        if (index === 0) {
          xy = "M"
        } else if (index === data.length - 1) {
          xy = ''
        } else {
          xy = 'L'
        }
        xy += coordinate.join(' ')
        return xy
      }).join(' '),
      fill: 'none',
      stroke: 'black'
    }
    );
    this.childs.push(new Node(svgPath))
  }
}

class SVGGenerator {

  createLayout(width, height) {
    const svg = new Element('svg').attr({
      xmlns: "http://www.w3.org/2000/svg",
      width, height
    });
    this.root = new Node(svg)
  }

  getRoot() {
    return this.root
  }

  appendChild(node) {
    this.root.appendChild(node)
  }

  setChilds(nodes) {
    this.root.childs = nodes
  }

  render() {
    function traversal(node) {
      const currentElement = node.value
      const [headTag, closeTag] = currentElement.render()
      if (currentElement.isSingleTag) return `${headTag}\r`

      let renderedStr = `${headTag}\r`
      let childs = node.childs
      if (childs) {
        for (let i = 0; i < childs.length; i++) {
          renderedStr += traversal(childs[i])
        }
      }
      return renderedStr + closeTag + `\r`
    }
    return traversal(this.root)
  }

  export(name) {
    const headStr = '<?xml version="1.0" encoding="UTF-8"?>\r'
    const renderedSVG = headStr + this.render();
    const filePath = `${__dirname}/output/${name}.svg`

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFile(filePath, renderedSVG, (err) => {
      if (err) throw err;
    })
  }
}

module.exports = SVGGenerator
module.exports.Element = Element
module.exports.Node = Node
