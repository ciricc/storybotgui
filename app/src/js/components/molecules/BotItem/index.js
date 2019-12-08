import React from 'react';

import {
  Group,
  Cell,
  InfoRow,
  CellButton,
  Button,
  Progress,
  Avatar,
} from '@vkontakte/vkui';

import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28BugOutline from '@vkontakte/icons/dist/28/bug_outline';


export default class BotItem extends React.Component {
  render () {
    return (
      <Group>
        <Cell description={"Не запущен"} asideContent={<Button>Запустить</Button>} before={<Avatar src="https://sun9-5.userapi.com/c850736/v850736359/ee497/efT2zlGFFzs.jpg?ava=1"/>}>Бот #1212</Cell>
        <Cell>
          <InfoRow title="Просмотрено историй: 1230">
            <div style={{marginTop: 8}}>
              <Progress value={80}/>
            </div>
          </InfoRow>
        </Cell>
        <CellButton before={<Icon28SettingsOutline/>}>Настроить бота</CellButton>
        <CellButton before={<Icon28BugOutline/>}>Посмотреть логи</CellButton>
        <CellButton level="danger" before={<Icon28DeleteOutlineAndroid/>}>Удалить бота</CellButton>
      </Group>
    );
  }
}

