import React, {Fragment} from 'react'
import Header from "../../Components/Header";
import MainSection from "../../Components/MainSection";
import Footer from "../../Components/home/Footer";
import {Translation} from "react-i18next";
import Image from "../../Components/Image";
import Fields from "../../Components/formWidget/Fields";
import Button from "../../Components/formWidget/Button";
import {fetchApi} from "../../Utils/Fetch";


class ConfigSociety extends React.Component {

    state = {

    }

    componentDidMount = async() => {
        await this.getAllSkin()
        await this.getSocietyData()
    }

    async getSocietyData(){
        let response = await fetchApi(`society/get_data?id=null`, 'GET')

        if (response) {
            const state = await response
            this.setState(state)
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault()
        await fetchApi('society/edit', 'PATCH', true, {
            share_mail: this.state.share_mail,
            agora_smart: this.state.agora_smart,
            skin_default: this.state.skin_default,
            monograin_scorm: this.state.monograin_scorm
        })
    }

    async getAllSkin(){
        let response = await fetchApi('skin/get_all', 'GET')

        if (response){
            const skins = await response
            this.setState({skins})
        }
    }

    handleChange(event) {
        let state = this.state
        state[event.target.name] = event.target.value

        this.setState(state)
    }


    render() {
        return (
            <div id='container'>
                <Header />
                <MainSection>
                    <section>
                        <form className='manager__form' onSubmit={(event) => this.handleFormSubmit(event)}>
                            <Translation>
                                {
                                    (t) =>
                                        <fieldset className='user__profile'>
                                            <legend><Translation>{(t) => t('_USER_PROFIL')}</Translation></legend>
                                            <div className='society__wrapper'>
                                                <ul>
                                                    <Fields
                                                        htmlFor='share_mail'
                                                        text='_SOCIETY_SHARE_MAIL'
                                                        inputType='email'
                                                        onChange={(event) => this.handleChange(event)}
                                                        value={this.state.share_mail}
                                                    />
                                                    <Fields
                                                        htmlFor='agora_smart'
                                                        text='_SOCIETY_AGORA_LINK'
                                                        inputType='url'
                                                        onChange={(event) => this.handleChange(event)}
                                                        value={this.state.agora_smart}
                                                    />
                                                </ul>
                                                <ul>
                                                    <Fields
                                                        htmlFor='skin_default'
                                                        text='_DEFAULT_SKIN'
                                                    >
                                                        <select name='skin_default' id='skin_default' value={this.state.skin_default} onChange={(event) => this.handleChange(event)}>
                                                            {
                                                                this.state.skins !== undefined && this.state.skins instanceof Array ?
                                                                    this.state.skins.map((s, key) => (
                                                                        <option key={key} value={s.id}>{s.theme_name} ({s.color})</option>
                                                                    ))
                                                                    :
                                                                    <Fragment />
                                                            }
                                                            <option value='0'>{t('_CHOOSE_SKIN')}</option>
                                                        </select>
                                                    </Fields>

                                                    <Fields
                                                        htmlFor='monograin_scorm'
                                                        text='_MONOGRAIN'
                                                        helpTitle={'_HELP_MONOGRAIN'}
                                                    >
                                                        <select name='monograin_scorm' id='monograin_scorm' value={this.state.monograin_scorm} onChange={(event) => this.handleChange(event)}>
                                                            <option value={true}>{t('_YES')}</option>
                                                            <option value={false}>{t('_NO')}</option>
                                                        </select>
                                                    </Fields>
                                                </ul>
                                                <Button
                                                    className='orange__btn'
                                                    buttonText='_SAVE'
                                                    buttonType='submit'
                                                    onClick={(event) => this.handleFormSubmit(event)}
                                                />
                                            </div>
                                        </fieldset>
                                }
                            </Translation>
                        </form>
                    </section>
                </MainSection>
                <Footer/>
            </div>
        );
    }
}


export default ConfigSociety