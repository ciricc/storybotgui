import React from 'react';

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let widths = { 
  '2': ['\'', 'i', 'j', 'l', '|', '!', '`'],
  '3':[',', '-', '.', ':', ';'],
  '3.4': ['f', 'r', 't'],
  '4': ['"', '*', ")", "(", '/', '{', '}', '[', '\\', ']' ],
  '5': ['J', '^', 'c', 'k', 's', 'v', 'x', 'y', 'z'],
  '6':
   [ '#',
     '$',
     '+',
     '0',
     '1',
     '2',
     '3',
     '4',
     '5',
     '6',
     '7',
     '8',
     '9',
     '<',
     '=',
     '>',
     '?',
     'F',
     'L',
     'T',
     'Z',
     '_',
     'a',
     'b',
     'd',
     'e',
     'g',
     'h',
     'n',
     'o',
     'p',
     'q',
     'u',
     '~'],
  '7':
   [ '&',
     'A',
     'B',
     'C',
     'D',
     'E',
     'H',
     'K',
     'N',
     'P',
     'R',
     'S',
     'U',
     'V',
     'X',
     'Y',
     'w'],
  '8':
   [ '\u0000',
     '\u0001',
     '\u0002',
     '\u0003',
     '\u0004',
     '\u0005',
     '\u0006',
     '\u0007',
     '\b',
     '\u000e',
     '\u000f',
     '\u0010',
     '\u0011',
     '\u0012',
     '\u0013',
     '\u0014',
     '\u0015',
     '\u0016',
     '\u0017',
     '\u0018',
     '\u0019',
     '\u001a',
     '\u001b',
     '\u001c',
     '\u001d',
     '\u001e',
     '\u001f',
     'G',
     'M',
     'O',
     'Q',
     'm'],
  '9': ['%', 'W', '@'] 
}

let widthsKeys = {}

for (let index in widths) {
  let chars = widths[index];
  chars.forEach(char => {
    widthsKeys[char] = index
  });
}


export default class MinecraftCodeObfuscated extends React.PureComponent {
  constructor (props) {
    super(props);

    this.allowedWidths = [];
    this.id = new Date().getTime() + '' + Math.floor(Math.random() * 1000);

    this.props.word.value.split('').forEach(char => {
      let charWidthIndex = widthsKeys[char] || '6';
      this.allowedWidths.push(charWidthIndex);
    });

    this.value = this.randomString(this.props.word.value.length);
    this.valueArray = this.value.split('') || [];

    this.intervals = [];
    this.rendering = true;

  }

  componentDidMount () {

    for (let i = 0; i < this.value.length; i++) {
      const renderer = () => {
        this.replaceChar(i);
        if (this.rendering) {
          window.webkitRequestAnimationFrame(renderer);
        }
      }
      window.webkitRequestAnimationFrame(renderer);
    }

  }

  componentWillUnmount () {
    this.rendering = false;
  }

  randomString (len) {
    let string = "";
    for (let i =0; i < len; i++) {
      string += String.fromCharCode(rand(64,95));
    }
    return string;
  }

  replaceChar(i) {
    let chars = widths[this.allowedWidths[i]];
    let char = chars[rand(0, chars.length-1)]
    this.value = this.value.substr(0, i) + char + this.value.substr(i + 1);
    this.valueArray = this.value.split('') || [];

    const letterDomElement = document.getElementById("letter" + this.id + '' + i)
    if (letterDomElement) {
      letterDomElement.innerText = char;
    }
  }

  render () {
    return (<span className={this.props.classnames}>{this.valueArray.map((e, i) => {
      return (<span className="letter" id={"letter" + this.id + '' + i}>{e}</span>);
    })}</span>)
  }
}