import React from 'react';

import {ModalCard} from '@vkontakte/vkui';

import Icon56MailOutline from '@vkontakte/icons/dist/56/mail_outline';

export default class NoAccessToNotifyModalCard extends React.PureComponent {
  render () {
    return (
      <ModalCard
        id={this.props.id}
        onClose={this.props.onClose}
        icon={<Icon56MailOutline/>}
        title="Мы не получили доступ к отправке сообщений для Вас"
        actions={[{
          title: 'ОК',
          type: 'secondary',
          action: this.props.onClose
        }]}
      />
    );
  }
}