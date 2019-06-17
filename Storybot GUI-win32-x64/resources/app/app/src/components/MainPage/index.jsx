import React from 'react';
import PropTypes from 'prop-types';

import { 
  View, 
  Panel, 
  PanelHeader, 
  Group, 
  List, 
  CellButton, 
  Avatar, 
  Cell, 
  Button, 
  Div, 
  FormLayoutGroup, 
  Input, 
  FormLayout 
} from '@vkontakte/vkui';

import { Grid, Row, Col } from 'react-flexbox-grid';

import Icon24AddOutline from '@vkontakte/icons/dist/24/add_outline';

// Подключаем стили компонента
import './MainPage.css';

/** 
 * Компонент для главной страницы (включает в себя настройку ботов и аккаунтов)
 */
export default class MainPage extends React.Component {
  
  constructor (props) {
    
    super(props);

    this.state = {
      /** Текущее состояние activePanel */
      activePanel: this.props.route.activePanel
    }

    /** Нужно ли обновлять в данный момент компонент */
    this.shouldUpdate = true;
  }

  componentWillUpdate (props, nextProps, a) {
    if (!this.shouldUpdate) return false;
    
    this.shouldUpdate = false;

    // Выставляем новые значения activePanel
    this.setState({
      activePanel: props.route.activePanel
    }, () => this.shouldUpdate = true);
  }

  render () {
    return (
      <View header={false} id={this.props.id} activePanel={this.state.activePanel}>
        <Panel id="main">
          <Grid fluid>
            <Row>
              <Col xs={12} md={5}>
                <Group title="Добавленные аккаунты и токены">
                  <List>
                   <Cell 
                    size="l"
                    description="Стабильно работает"
                    before={<Avatar src="https://pp.userapi.com/c850232/v850232545/13281c/sUEmokE8378.jpg?ava=1"size={40}/>}
                    bottomContent={<div style={{display: 'flex'}}><Button size="m">Изменить</Button><Button style={{marginLeft: 8}} size="m" level="secondary">Удалить</Button></div>} >
                    Кирилл Новак
                   </Cell>
                   <Cell 
                    size="l"
                    description="Стабильно работает"
                    before={<Avatar src="https://pp.userapi.com/c639219/v639219895/4d35d/xbxUdzZZLfc.jpg?ava=1"size={40}/>}
                    bottomContent={<div style={{display: 'flex'}}><Button size="m">Изменить</Button><Button style={{marginLeft: 8}} size="m" level="secondary">Удалить</Button></div>} >
                    Никита Антоновка
                   </Cell>
                   <Cell 
                    size="l"
                    description="Стабильно работает"
                    before={<Avatar src="https://sun1-24.userapi.com/c831109/v831109539/1da1e5/lJwUOitbYMQ.jpg?ava=1"size={40}/>}
                    bottomContent={<div style={{display: 'flex'}}><Button size="m">Изменить</Button><Button style={{marginLeft: 8}} size="m" level="secondary">Удалить</Button></div>} >
                    Илья Сивальнев
                   </Cell>
                   <Div>
                    <Cell description="Токен группы">
                       <span>52f8522bf28e8dc110b03abec7813e580abf5524205235962a0fb4cd5c8...</span>
                     </Cell>
                   </Div>
                  </List>
                  <CellButton before={<Icon24AddOutline/>} onClick={ () => {
                      this.props.history.push('addBot')
                  } }>
                    Добавить аккаунт
                  </CellButton>
                </Group>
              </Col>
              <Col xs={12} md={7}>
                <Group title="Работающие боты Storybot">
                  <CellButton before={<Icon24AddOutline/>}>
                    Добавить бота
                  </CellButton>
                </Group>
              </Col>
            </Row>
          </Grid>
        </Panel>
        <Panel id="addBot">
          <Grid fluid>
            <Row style={{paddingTop: 15}}>
              <Col md={4}>
              </Col>
              <Col md={4}>
                <Group>
                 <Div>
                   <FormLayout>
                    <FormLayoutGroup top="Логин">
                      <Input/>
                    </FormLayoutGroup>
                    <FormLayoutGroup top="Пароль">
                      <Input type="password"/>
                    </FormLayoutGroup>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      <Button size="l">Добавить</Button>
                      <Button size="l" level="secondary" onClick={() => {
                        this.props.history.goBack();
                      }}>Отмена</Button>
                    </div>
                   </FormLayout>
                 </Div>
                </Group>
              </Col>
            </Row>
          </Grid>
        </Panel>
      </View>
    );
  }
}

MainPage.propTypes = {
  /** Объект для работы с текущим состоянием истории браузера */
  route: PropTypes.object,
  /** Объект истории браузера */
  history: PropTypes.object,
  id: PropTypes.string
} 