import React from 'react'
import { shallow, mount } from 'enzyme'
import {Redirect} from 'react-router-dom'
import Button from './Components/formWidget/Button'
import Connection from './pages/Connection'
import Home from './pages/Home'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

  describe('Connection component', () => {
      const handleFormSubmitMock = jest.fn();
      const props = {
      buttonType:'submit',
      buttonTitle: 'Connexion',
      className: 'button',
      onClick: () => handleFormSubmitMock()
    }

    it('Contains button and state redirect to false', () => {
      const wrapper = mount(<Connection />)
      expect(wrapper.find('.button'))
      expect(wrapper.state('redirect')).toEqual(false)
    })

    it('Connect', () => {
      const wrapper = shallow(<Button {...props} />);
      wrapper.find('.button').simulate('click')
      expect(handleFormSubmitMock).toHaveBeenCalled()
    })
  })



