import React, { Fragment } from 'react'

import hmacSHA256 from 'crypto-js/hmac-sha256'

//Structure
import BlockSkeleton from './BlockSkeleton'

//i18n
import { Translation } from 'react-i18next'

//Utilitaires
import Fields from '../Components/formWidget/Fields'

//BlockIntegratedObject
import IntegratedObject from './IntegratedObject'
import {fetchApi} from "../Utils/Fetch";

class BlockIntegratedObjects extends BlockSkeleton{

    constructor(props){
        super(props);
        this.state = {
            lang: props.lang,
            disableButton: true,
            position: props.nbBlock,
            type: '_EO_BLOCK',
            options: {
                url: '',
                similar: false
            },
        }
    }

    async getAllTheme(){
        let response = await fetchApi('eot/get_all', 'GET')

        if (response){
            let eoThemes = await response

            this.setState({eoThemes})
        }
    }

    async getAllEmbededInformation(){
        let response = await fetchApi('eo', 'GET')

        if (response){
            let eos = await response
            this.setState({eos})
        }
    }

    componentDidMount = async() => {
        super.componentDidMount()
        await this.getAllTheme()
        await this.getAllEmbededInformation()
        if (this.props.id_block !== undefined)
        {
            await this.getBlockContent()
        }
        else
        {
            await this.sendBlockToBack()
        }
    }
    displayList = (key) => {
        if(this.state.visibility === ''){
            this.setState({displayList:true, openTheme: key})
            this.setState({visibility:'deplie'})
        } else {
            this.setState({displayList:false, openTheme: undefined})
            this.setState({visibility:''})
        }
    }

    Content = () => {
        return(
            <ul className='content-list'>
                <Fields 
                    liClass='content-element' 
                    htmlFor='code' 
                    className='grey__label' 
                    text='_EO_CODE' 
                    textarea={true} 
                    textareaClass='orange-textarea'
                    value={this.state.options.url} 
                    onChange={(event, target) => this.handleChange(event, 'url')}
                />
            </ul>
        )
    }

    Options = () => {}

    Help = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{t('_EO_BLOCK')}</h3>
                        <p>{t('_EO_HELP_1')}</p>
                        <ul>
                            <li>{t('_EO_HELP_2')}</li>
                            <li>{t('_EO_HELP_3')}</li>
                            <li>{t('_EO_HELP_4')}</li>
                            <li>{t('_EO_HELP_5')}</li>
                        </ul>
                        <p>{t('_EO_HELP_6')}</p>
                        <ul className='integrated-object-list'>

                            {
                                this.state.eoThemes !== undefined ?
                                    this.state.eoThemes.map((theme, key) => (
                                        this.state.openTheme === key ?
                                            <li className={'integrated-object-theme deplie'} onClick={(k) => this.displayList(key)}>
                                                <Translation>
                                                    {(t) => <span>{t(`${theme.title}`)}</span>}
                                                </Translation>
                                                <ul className='list-integrated-objects'>
                                                    {
                                                        this.state.eos !== undefined && this.state.eos[theme.title] !== undefined ?
                                                            this.state.eos[theme.title].map((eo, key) => (
                                                                <IntegratedObject
                                                                    key={key}      
                                                                    srcImg={`/assets/img/eoLogo/${eo.logo}`}
                                                                    altText={`Logo de ${eo.title}`}
                                                                    link={eo.url}
                                                                    title={eo.title}
                                                                    description={eo.description}
                                                                />
                                                            ))
                                                        :
                                                        <Fragment />
                                                    }
                                                </ul>
                                            </li>
                                        :
                                            <li className={'integrated-object-theme'} onClick={(k) => this.displayList(key)}>
                                                <Translation>
                                                    {(t) => <span>{t(`${theme.title}`)}</span>}
                                                </Translation>
                                                <ul className='list-integrated-objects'>
                                                </ul>
                                            </li>
                                    ))
                                :
                                <Fragment />
                            }
                        </ul>
                        </Fragment>
                }
            </Translation>
        )
    }

    render(){
        return(
            super.render()
            )
        }
    }


export default BlockIntegratedObjects