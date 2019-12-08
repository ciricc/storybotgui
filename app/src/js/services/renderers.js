import React from 'react';

// Файл для создания рендеров чего угодно
import Icon24Palette from '@vkontakte/icons/dist/24/palette';
import Icon24Up from '@vkontakte/icons/dist/24/up';
import Icon24Attachments from '@vkontakte/icons/dist/24/attachments';
import Icon24MarketOutline from '@vkontakte/icons/dist/24/market_outline';

export const getPayName = (type=0) => {
  switch (type) {
      case 1:
          return "Цветное название";
      case 2:
          return "Поднятие рейтинга";
      case 3:
          return "Поднятие рейтинга за монеты";
      case 4:
          return "Обложка"
      default:
          return "Другое";
  }
}

export const getPayIcon = (type=0) => {
  switch (type) {
      case 1:
          return (<Icon24Palette/>);
      case 2:
          return (<Icon24Up/>);
      case 3:
          return (<Icon24Up/>);
      case 4:
          return (<Icon24Attachments/>);
      default:
          return (<Icon24MarketOutline/>);
  }
}
