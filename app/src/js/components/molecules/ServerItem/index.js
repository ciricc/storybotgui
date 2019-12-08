import React from 'react';
import {connect} from 'react-redux';

import RouteLink from '../../atoms/RouteLink';
import MinecraftCodes from '../../atoms/MinecraftCodes';

import {Button, HorizontalScroll, Snackbar, Link} from '@vkontakte/vkui';
import {setSnack} from '../../../store/app/actions';

import Icon16CancelCircleOutline from '@vkontakte/icons/dist/16/cancel_circle_outline';
import Icon16CheckCircleOutline from '@vkontakte/icons/dist/16/check_circle_outline';

import Icon16Users from '@vkontakte/icons/dist/16/users';
import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16Up from '@vkontakte/icons/dist/16/up';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon16Verified from '@vkontakte/icons/dist/16/verified';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon24Copy from '@vkontakte/icons/dist/24/copy';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon24Airplay from '@vkontakte/icons/dist/24/airplay';
import Icon24Forward from '@vkontakte/icons/dist/24/forward';

import {CopyToClipboard} from 'react-copy-to-clipboard';
import Linkify from 'react-linkify';

import {GROUP_ID} from '../../../services/VK';

import classnames from 'classnames';

import './ServerItem.css';


class ServerItem extends React.PureComponent {

  constructor (props) {
    super(props);
    this.snacks = {
      successCopyIp: this.completeCopyIpSnack()
    }
  }

  copyIp = () => {
    this.props.setSnack(this.snacks.successCopyIp)
  }

  completeCopyIpSnack = () => {
      return (
          <Snackbar before={<Icon24Done fill="#16C60C"/>} onClose={() => this.props.setSnack(null)}>IP адрес скопирован!</Snackbar>
      );
  }

  saveServer = (server) => {
    if (this.props.onSaveServer) {
      this.props.onSaveServer(this.props.server);
    }
  }

  render () {
    
    let { server } = this.props;

    let prefix = this.props.prefix || "";
    
    if (prefix) {
      prefix += "_";
    }

    let versions = this.props.versions || {};

    let minSupportedVersion = versions[server.min_supported_version] || {};
    let maxSupportedVersion = versions[server.max_supported_version] || {};
    let serverHref = prefix + "server";

    return (
        <div className="server-item">
             <RouteLink href={serverHref} params={server}>
               <div className="server-item--title">
                {server.favicon && <div className="server-item--favicon">
                  <img src={server.favicon} alt="favicon" width="48"/>
                </div> }
                <div className="server-item--name">
                  {server.colored_name ? <MinecraftCodes name={server.colored_name}/> : server.name}
                </div>
               </div>
             </RouteLink>
             {server.cover ?
                <RouteLink href={serverHref} params={server}><div className="server-item--cover">
                    <img src={server.cover} alt="Картинка сервера"/>
                </div></RouteLink>
             : null}
             <RouteLink href={serverHref} params={server}>
             <div className="server-item--status">
              <div className="server-item--status-item">
                <div className="server-item--status-item-icon green">
                  <i className="fas fa-signal"></i>
                </div>
                <div className="server-item--status-item-content">
                  {server.online}
                </div>
              </div>
              <div className="server-item--status-item">
                <div className="server-item--status-item-icon red">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="server-item--status-item-content">
                  {server.hearts || "0"}
                </div>
              </div>
              <div className="server-item--status-item">
                <div className="server-item--status-item-content description">
                  {server.launcher_link ? "ЛАУНЧЕР" : server.ip_addr}
                </div>
              </div>
             </div>
             </RouteLink>
             <HorizontalScroll>
              <div style={{display: 'flex'}}>
                <span className="tag active">{
                  server.min_supported_version === server.max_supported_version ? 
                    versions[server.min_supported_version].version : 
                      `${versions[server.min_supported_version].version} - ${versions[server.max_supported_version].version}`} 
                      {server.type === 2 ? " (PE)" : ""}</span>
                {server.status === 1 ? <span className="tag active red"><span className="tag-before"><Icon16CancelCircleOutline/></span>Не подтвержден</span> : 
                  <span className="tag active green"><span className="tag-before"><Icon16CheckCircleOutline/></span>Подтвержден</span>
                }

                {server.tags && !this.props.hideTags && server.tags.map((tag, i) => {
                  let tagName = this.props.tags.find(tagProp => tagProp.id === tag) || {};
                  // console.log(tagName);
                  tagName = tagName.tag_name;
                  return (<span className="tag" key={"tag_" + i}>{tagName}</span>)
                })}
              </div>
             </HorizontalScroll>
            <div className="server-item--status-item-row buttons">
              {server.owner_id === this.props.userVKId && <RouteLink href={"upgrade_" + this.props.activeView} params={server}><Button size="xl" level="secondary">Улучшить</Button></RouteLink>}
              {server.owner_id === this.props.userVKId && server.status === 1 && <RouteLink href={"verify_" + this.props.activeView} params={server}><Button size="xl" level="primary">Подтвердить</Button></RouteLink>}
              {server.owner_id !== this.props.userVKId && !server.launcher_link && <CopyToClipboard text={server.ip_addr}
                                    onCopy={()=>this.copyIp()}><Button before={<Icon24Copy/>} style={{flex: 2}} size="xl" level="outline">Играть</Button></CopyToClipboard>}
              {server.owner_id !== this.props.userVKId && server.launcher_link && 
                <Linkify componentDecorator={(href, text, key) => {
                  return (<Link className="Button" href={href} key={key} target="_blank" rel="noopener noreferrer"><Button level="commerce" style={{flex: 2}} size="xl">Играть</Button></Link>);
                }}>{server.launcher_link}</Linkify>
              }

              {server.owner_id !== this.props.userVKId && <Button before={<Icon24Airplay/>} onClick={this.saveServer} style={{flex: 9}}>Сохранить</Button>}
            </div>
        </div>
    );
  }
}

export default connect((state) => {
  return {
    activeView: state.router.activeView
  }
}, {setSnack})(ServerItem);