import React, { Component, Fragment } from 'react'


import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_editor.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/languages/fr.js'
import 'froala-editor/js/third_party/image_tui.min.js';
import 'froala-editor/js/third_party/embedly.min.js';
import 'froala-editor/js/third_party/spell_checker.min.js';
import hmacSHA256 from "crypto-js/hmac-sha256";

import QuestionBlockOptions from '../Blocks/QuestionBlockOptions'
import Content from './General/Content'
import Help from './General/Help'

import Button from '../Components/formWidget/Button'
import NavBarSecondary from '../Components/NavBarSecondary'
import DeleteModal from '../Components/modal/DeleteModal'

//Style pour tout les blocs
import './Blocks.scss'
import { Translation } from 'react-i18next'
import {fetchApi} from "../Utils/Fetch";

class QuestionSkeleton extends Component {

    constructor({props}){
        super(props)
        this.state = {
            question_score: 0,

            configFroala : {
                language:'fr',
                colorsHEXInput: false,
                autoFocus: true,
                toolbartop: false,
                multiline: true,
                linkAlwaysBlank: true,
                fontFamilySelection: true,
                fontSizeSelection: true,
                paragraphFormatSelection: true,
                htmlExecuteScripts: true,
                iframe: true,
                tabSpaces: 4,
                charCounterCount:false,
                key: window.$froala,
                imageUpload: true,
                imageUploadMethod: 'POST',
                imageUploadParam: 'file',
                imageUploadRemoteUrls: true,
                imageUploadURL: `${window.$url}block/froala/upload?id_grain=${props.id_grain}&security=${btoa(hmacSHA256('/block/froala/upload', window.$sha).toString() + ':' + window.$user)}`,

            }
        }
    }

    componentDidMount(){
        this.setState({disableButton: true})
        this.setState({isDelete: this.props.askDelete})
        this.Tabs()
    }

    async getBlockContent(){
        let response = await fetchApi(`grain/question/get?lang=${this.state.lang}&id=${this.props.id_block}`, 'GET')
        
        if (response){
            const state = await response
            this.setState(state)
        }
    }

    handleChange(event, target, checkbox, data) {
        let {options} = this.state
        if (undefined !== checkbox)
        {
            options[target] = event.target.checked;
            this.setState({options})
        }
        else if(undefined !== data)
        {
            options[target] = data;
            this.setState({options})
        }
        else
        {
            options[target] = event.target.value;
            this.setState({options})
        }
        if (this.state.disableButton === true){
            this.setState({disableButton: false})
        }
    }

    async sendBlockToBack(){
        let response = await fetchApi('grain/question/save', 'POST', true, {
            lang: this.state.lang,
            options: this.state.options,
            id: this.props.id_block !== undefined ? this.props.id_block : null,
            position: this.props.position !== undefined ? this.props.position : this.state.position,
            type: this.state.type,
            grain_id: this.props.id_grain,
            question_score: this.state.question_score !== undefined ? this.state.question_score : 0,
            media: this.state.media !== undefined ? this.state.media : null,
            newBlock: !this.state.disableButton
        })
        
        if (response){
            const informationBlock = await response
            await this.props.newBlock(informationBlock.id, !this.state.disableButton)
            await this.getBlockContent()
        
        }
    }

    onCancelDelete(){
        this.setState({isDelete: false})
        this.props.delete()
    }

    async deleteBlock(){
        let response = await fetchApi('block/delete', 'DELETE', true, {
            id: this.props.id_block
        })


        if (response){
            await this.props.newBlock()
            this.setState({isDelete: false})
            await this.props.delete()

        } else {
            if (response.status === 404) {
                console.log('ID incorrect : ' + this.props.id_block)
            }
        }
    }



    evenement = (tabs) => {
        this.setState({currentTab: tabs})
    } 

    Content = () => {}

    Options = () => {}

    Help = () => {}

    Tabs = () => {
        this.setState({tabs: [
            {'text': '_CONTENT', 'class': 'tab__link actif', 'link': '#contenu'},
            {'text': 'Options', 'class': 'tab__link', 'link': '#options'},
            {'text': '_HELP', 'class': 'tab__link', 'link': '#aide'},
        ], currentTab:'CONTENU'})
    }

    render () {
        const editorConfiguration = {
            removePlugins:['Heading'],
            toolbar: [ 'undo', 'redo', 'alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'bold', 'italic', 'strikethrough', 'underline', 'blockQuote', 'ckfinder', 'imageTextAlternative', 'imageUpload', 'heading', 'imageStyle:full', 'imageStyle:alignLeft', 'imageStyle:alignRight', 'indent', 'outdent', 'link', 'numberedList', 'bulletedList', 'mediaEmbed', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells'],
            language:'fr'
        };
        return (
             <Fragment>
                 {
                     this.state.isDelete ?
                        <DeleteModal onAnnul={() => this.onCancelDelete()} onOk={() => this.deleteBlock()} /> :
                        <Fragment />
                 }
                <NavBarSecondary className='blocks__menu' tabs={this.state.tabs} evenement={(tabs) => this.evenement(tabs)}/>
                {
                    this.state.currentTab === 'CONTENU' ? 
                        <Content>
                            {this.Content()}
                            <ul className='btn__list inherit'>
                            <li>
                                    <Button
                                        className='orange__btn'
                                        type='submit'
                                        buttonText='_SAVE'
                                        onClick={() => this.sendBlockToBack()}
                                        disable={this.state.disableButton}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='grey__btn'
                                        type='reset'
                                        buttonText='_DELETE'
                                        onClick={() => this.setState({isDelete: true})}
                                    />
                                </li>
                            </ul>
                        </Content>
                    : 
                        <Fragment/>
                }
                {
                    this.state.currentTab === 'OPTIONS' ?
                        <section className='options__section'>
                            <ul className='options-list'> 
                                <QuestionBlockOptions
                                    question_score={this.state.question_score}  
                                    changeNote={(event) => this.setState({question_score: event.target.value, disableButton: false})}
                                />
                                {this.Options()}
                                <Translation>
                                    {
                                        (t) => 
                                        <Fragment>
                                            <h6 className='grey__label'>{t('_FEEDBACK')}</h6>
                                            <p>{t('_FEEDBACK_POSITIVE')}</p>
                                            <FroalaEditorComponent
                                                config={this.state.configFroala}
                                                model={this.state.options.feedback_correct}
                                                onModelChange={(model) => this.handleChange(undefined, 'feedback_correct', undefined, model)}
                                            />
                                            <p>{t('_FEEDBACK_NEGATIVE')}</p>

                                            <FroalaEditorComponent
                                                config={this.state.configFroala}
                                                model={this.state.options.feedback_incorrect}
                                                onModelChange={(model) => this.handleChange(undefined, 'feedback_incorrect', undefined, model)}
                                            />
                                        </Fragment>
                                    }
                                </Translation>
                            </ul>
                            <ul className='btn__list'>
                                <li>
                                    <Button
                                        className='orange__btn'
                                        type='submit'
                                        buttonText='_SAVE'
                                        onClick={() => this.sendBlockToBack()}
                                        disable={this.state.disableButton}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='grey__btn'
                                        type='reset'
                                        buttonText='_DELETE'
                                        onClick={() => this.setState({isDelete: true})}
                                    />
                                </li>
                            </ul>
                        </section>  
                     : <Fragment/>
                }
                {
                    this.state.currentTab === 'AIDE' ?
                        <Help>
                            {this.Help()}
                        </Help>
                    : <Fragment/>
                }
                </Fragment>
        )
    }
}

export default QuestionSkeleton