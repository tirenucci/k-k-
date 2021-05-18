import React, { Component } from 'react'

//i18n
import { Translation, withTranslation } from 'react-i18next'

//Utilitaires
import Title from '../Components/Title'
import Button from '../Components/formWidget/Button'

//Style
import './Connection.scss'
import {fetchApi} from "../Utils/Fetch";

class ExpiredToken extends Component {

    constructor({props}){
        super(props)
    }

    componentDidMount () {
        /*Permet d'ajouter une classe différente au body afin de ne pas conserver le style définit pour le body d'autre components*/
        document.body.className='body__connection'
        document.title = this.props.title
    }

    async resendMail(){
        await fetchApi(`user/resendmail`, 'POST', true, {
            id: this.props.id
        })
    }

    render () {
        return (
            <section className='connection__section'>
                <Title additionalClass='connection__title' text='_EXPIRED_LINK'/>
                <article className='connection__form'>
                    <p><Translation>{(t) => t('_EXPIRED_TIME')}</Translation></p>
                    {
                        this.props.avatar === '1' ?
                            <p><Translation>{(t) => t('_EXPIRED_PASSWORD')}</Translation></p>
                        :

                            <p><Translation>{(t) => t('_EXPIRED_REGISTRATION')}</Translation></p>
                    }
                    <Button
                        className='connect__btn'
                        buttonType='button'
                        buttonText='_CLICK'
                        onClick={() => this.resendMail()}
                    />
                </article>
        </section>
        )
    }
}

export default withTranslation()(ExpiredToken)