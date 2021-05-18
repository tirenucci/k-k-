import React, { Component, Fragment} from 'react'
import cookie from 'react-cookies'

//For Preview 
import ShareTools from '../../Components/ShareTools'
import ButtonPreview from '../../Components/preview/ButtonPreview'
import LangSelector from '../../Components/preview/LangSelector'

//Utilitaire
import Button from '../../Components/formWidget/Button'

//i18n
import { Translation } from 'react-i18next'

//Style
import './Preview.scss'
import {fetchApi} from "../../Utils/Fetch";

class Preview extends Component {
    constructor ({props}) {
        super(props)
    }

    state = {
        redirect: false,
        languages: 2,
        showSummary: false,
        showLanguages: false,
        showShare: false,
        shareUrl:'',
        quote:''
    }

    componentDidMount(){
        document.body.style.padding = 0
        document.body.style.backgroundColor = '#2d2d2d'
        this.getHtml()
        document.title = this.props.title
    }

    async getHtml(lang = undefined)
    {
        let response
        if (lang === undefined)
        {
            response = await fetchApi(`preview/${this.props.match.params.id}`, 'GET', false)
        }
        else
        {
            response = await fetchApi(`preview/${this.props.match.params.id}/${lang}`, 'GET', false)
        }

        if (response){
            let data = await response
            this.setState({html: data, showSummary:true})
            if (this.state.showLanguages)
            {
                this.setState({showLanguages: false})
            }
            this.setIFrame(data['code'])
            document.title = this.state.html['name']
        }
    }

    setIFrame(data) {
        let iframe = document.querySelector('#previewIFrame');
        let iframeDoc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document
        iframeDoc.open()
        iframeDoc.write(data)
        iframeDoc.close()
    }

    show(){
        document.getElementById('sideNav').classList.add('visible');
        this.setState({showSummary:true, showLanguages:false, showShare: false})
    }

    hide(){
        document.getElementById('sideNav').classList.remove('visible');
        this.setState({showSummary:false, showLanguages: false, showShare: false})
    }

    showSecond(){
        document.getElementById('sideNav').classList.add('visible');
        this.setState({showSummary:false, showLanguages: false, showShare: true})
    }

    showLang(){
        document.getElementById('sideNav').classList.remove('visible');
        this.setState({showSummary:false, showLanguages: true, showShare: false})
    }

    render() {
        return (
            <Fragment>
                <nav className='preview__nav'>
                    <ul id='nav__list'>
                    <li>
                        {
                            this.state.showSummary === false ?
                            <Button
                                className='nav__btn summary'
                                buttonTitle='_SUMMARY'
                                onClick={() => this.show()}
                            />
                            :
                            <Button
                                className='nav__btn summary'
                                buttonTitle='_CLOSE'
                                onClick={() => this.hide()}
                            />
                        }
                        </li>
                        {
                            this.state.html !== undefined ?
                                this.state.html['lang'] !== undefined && this.state.html['lang'].length > 1 ?
                                    <li>
                                        <Button
                                            className='nav__btn languages'
                                            buttonTitle='_LANGS'
                                            onClick={() => this.showLang()}
                                        />
                                    </li>
                                :
                                    <Fragment/>
                            :
                                <Fragment/>
                        }
                        {
                            this.state.showShare === false ?
                            <li>
                                <Button
                                    className='nav__btn share'
                                    buttonTitle='_SHARE'
                                    onClick={() => this.showSecond()}
                                />
                            </li>
                            :
                            <li>
                                <Button
                                    className='nav__btn share'
                                    buttonTitle='_SHARE'
                                    onClick={() => this.hide()}
                                />
                            </li>
                        }
                    </ul>
                    <nav id='sideNav' className='visible'>
                    {
                        this.state.showSummary === true && this.state.html.grains !== undefined ?
                            <ul>
                                <li className='sideNav__title'>
                                    <Translation>{(t) => t('_PREVIEW_TABLE')}</Translation>
                                </li>
                                {
                                    this.state.html !== undefined ?
                                        this.state.html['grains'].map((g, key) => (
                                                atob(this.props.match.params.id).split('&')[1] != g.position ?
                                                    <li key={key} className='not__selected'>
                                                        <a href={`/training/preview/${window.btoa(g.id_training + '&' + g.position)}`}>{g.name}</a>
                                                    </li>
                                                    :
                                                    <li key={key} className='selected'>
                                                        <a href={`/training/preview/${window.btoa(g.id_training + '&' + g.position)}`}>{g.name}</a>
                                                    </li>
                                        ))
                                        :
                                        <Fragment/>
                                }
                            </ul>
                        : this.state.showShare === true ?
                        <ul>
                            <ShareTools
                                shareUrl={window.location.protocol + '//' + window.location.hostname + `/training/preview/${window.btoa(this.state.html.grains.id_training + '&' + 0)}`}
                                quote={this.state.html.name}
                            />
                        </ul>   
                        :
                        <Fragment/>
                    }
                    </nav>
                </nav>
                <div id='cle-container' className='training__container'>
                    <div id='cle-inner-container'>
                        <div className='preview__training'>
                            {
                                this.state.html !== undefined ?
                                    this.state.html['code'] === undefined && !this.state.showLanguages ?
                                        <Fragment>
                                            <link href={this.state.html['css']} rel='stylesheet'/>
                                            <header id='header'></header>
                                        </Fragment>
                                    :
                                        <Fragment />
                                :
                                    <Fragment />
                            }
                            <main id='main'>
                                    {
                                        this.state.html !== undefined ?
                                            this.state.html['code'] === undefined || this.state.showLanguages ? 
                                                <LangSelector
                                                    lang={this.state.html['lang']}
                                                    handleClick={(lang) => this.getHtml(lang)}
                                                />
                                            :  
                                            <Translation>
                                                {
                                                    (t) => 
                                                        <iframe frameBorder='0' id='previewIFrame' title={t('_PREVIEW_TITLE')}></iframe>
                                                }
                                            </Translation>
                                        :
                                        <Fragment />
                                    }  
                            </main>
                            {
                                this.state.html !== undefined ?
                                    this.state.html['code'] === undefined && !this.state.showLanguages ?
                                        <footer id='footer'></footer>
                                    :
                                        <Fragment />
                                :
                                    <Fragment/>
                            }
                        </div>
                    </div>
                </div>
                {
                    undefined !== this.state.html && this.state.html['grains'] instanceof Array && this.state.html['grains'].length > 1 ?
                        <ul className='preview__btn__nav'>
                            {
                                this.state.html['grains'][parseInt(atob(this.props.match.params.id).split('&')[1]) - 1] !== undefined ?
                                    <ButtonPreview 
                                        className='btn__previous'
                                        href={`/training/preview/${window.btoa(atob(this.props.match.params.id).split('&')[0] + '&' + (parseInt(atob(this.props.match.params.id).split('&')[1]) - 1))}`} 
                                        iText='chevron_left'
                                        align='left'
                                        buttonText='_PREVIOUS'
                                    />
                                :
                                    <Fragment/>
                            }
                            {
                                this.state.html['grains'][parseInt(atob(this.props.match.params.id).split('&')[1]) + 1] !== undefined ?
                                    <ButtonPreview 
                                        className='btn__next'
                                        href={`/training/preview/${window.btoa(atob(this.props.match.params.id).split('&')[0] + '&' + (parseInt(atob(this.props.match.params.id).split('&')[1]) + 1))}`} 
                                        buttonText='_NEXT'
                                        iText='chevron_right'
                                        align='right'
                                    />
                                :
                                    <Fragment/>
                            }
                        </ul>
                    :
                        <Fragment/>
                }
            </Fragment>
        )
    }
}

export default Preview