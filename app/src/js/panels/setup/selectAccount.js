import React from 'react';
import {connect} from 'react-redux';

import {setStateData} from '../../store/app/actions';
import {goBack, setPage} from '../../store/router/actions';
import OutlineMessage from '../../components/atoms/OutlineMessage';
import BackButton from '../../components/atoms/BackButton';

import {
    Panel,
    PanelHeader,
    Div,
    Search,
    Cell,
    Avatar
} from '@vkontakte/vkui';

import Icon24Done from '@vkontakte/icons/dist/24/done';

class SelectAccount extends React.Component {
    
    state = {
      selectedAccount: null
    }

    componentDidMount () {
      this.props.setStateData({
        selectedAccount: false
      });
    }

    render() {
        const {id} = this.props;
        let accounts = this.props.accounts.filter(acc => !!acc.vk_id);
        return (
            <Panel id={id} theme="white">
                <PanelHeader left={<BackButton/>}>Выберите аккаунт</PanelHeader>
                <Search placeholder="Поиск аккаута"/>
                {accounts.map((account, i) => (
                  <Cell key={"account_" + i} onClick={() => {
                    this.props.setStateData({
                      selectedAccount: account
                    });

                    this.props.goBack();
                  }} before={<Avatar src={account.photo_200}/>}>{account.first_name} {account.last_name}</Cell>
                ))}
            </Panel>
        );
    }

}

// Connection state from redux to component
const mapStateToProps = (state) => {
    return {
      accounts: state.app.accounts,
    }
}

// Dispatches to property functions
const mapDispatchToProps = {
    setPage,
    goBack,
    setStateData
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccount);