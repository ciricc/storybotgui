import React from 'react';

import classnames from 'classnames';
import MinecraftCodeObfuscated from './Obfuscated';

import './MinecraftCodes.css';

const {getColoredStringData} = require('minecraft-codes');



export default class MinecraftCodes extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {}
  }

  render () {
    let {name} = this.props;
  

    return (
      <span>
      {getColoredStringData(name).map((word, i) => {
        
        let classes = classnames("MinecraftCode", {
          [word.color]: true,
            "bold": word.isBold,
            "underline": word.isUnderline,
            "line-through": word.isLineThrough,
            "obfuscate": word.isObfuscate,
            "italic": word.isItalic
          });

        return (word.isObfuscate && !this.props.noObfuscate ? <MinecraftCodeObfuscated key={"word_" + i} word={word} classnames={classes}/>: <span key={"word_" + i} className={classes}>{word.value}</span>)})}</span>
    );
  }

}