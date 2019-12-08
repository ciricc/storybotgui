import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from '../../store/router/actions';
import OutlineMessage from '../../components/atoms/OutlineMessage';
import BackButton from '../../components/atoms/BackButton';

import {
    Panel,
    PanelHeader,
    Div,
    FormLayout,
    Checkbox
} from '@vkontakte/vkui';

class PanelSettings extends React.Component {
  updateTheme (e) {
    console.log(e);
    let checked = e.currentTarget.checked;
    console.log(checked);
    window.store.set('enable_dark_theme', checked);
    window.setScheme(checked ? "space_gray" : "bright_light")
  }

  render() {
      const {id} = this.props;
      let checkDarkTheme = window.store.get('enable_dark_theme', false);

      return (
          <Panel id={id} theme="white">
              <PanelHeader left={<BackButton/>}>Настройки программы</PanelHeader>
              <Div>
                  <FormLayout>
                  <Checkbox defaultChecked={checkDarkTheme} onChange={this.updateTheme}>Темная тема</Checkbox>
                  </FormLayout>
              </Div>
          </Panel>
      );
  }

}

// Connection state from redux to component
const mapStateToProps = (state) => {
    return {

    }
}

// Dispatches to property functions
const mapDispatchToProps = {
    setPage,
    goBack,
};

export default connect(mapStateToProps, mapDispatchToProps)(PanelSettings);