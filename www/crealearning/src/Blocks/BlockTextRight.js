import React, { Fragment } from 'react'

//i18n
import { Translation } from 'react-i18next'

import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_editor.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/languages/fr.js'
import 'froala-editor/js/third_party/image_tui.min.js';
import 'froala-editor/js/third_party/embedly.min.js';
import 'froala-editor/js/third_party/spell_checker.min.js';

//Structure
import BlockSkeleton from './BlockSkeleton'
import ImgOptions from './General/ImgOptions'

//Utilitaires
import Button from '../Components/formWidget/Button'
import Fields from '../Components/formWidget/Fields'
import FileManagerModal from "../Components/modal/FileManagerModal";

import hmacSHA256 from "crypto-js/hmac-sha256";

class BlockTextRight extends BlockSkeleton{

    constructor(props){
        super(props);
        this.state = {
            fileManager: false,
            lang: props.lang,
            position: props.nbBlock,
            disableButton: true,
            media: true,
            type: '_IMGR',
            options: {
                url: '_UNKNOWN',
                scale: 100,
                alt: '',
                text: '',
                similar: false
            },
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
        super.componentDidMount()
        if (this.props.id_block !== undefined)
        {
            this.getBlockContent()
        }
        else
        {
            this.sendBlockToBack()
        }
    }



    validImage(url) {
        let {options} = this.state

        options.url = url.replace('//', '/')


        this.setState({options, fileManager: false, disableButton: false})
    }

    Content = () => {
        return(
            <Fragment>
                { this.state.fileManager ? <FileManagerModal onlyType={'image'} validImage={(url) => this.validImage(url)}  training={this.props.trainingUuid} title={"Bibliothèque"} onAnnul={() => this.setState({fileManager: false})} /> : <Fragment /> }
                <ul className='content-list'>
                    <Fields
                            liClass='content-element wrap'
                            inputType='text'
                            htmlFor='source'
                            text='_IMG_SOURCE'
                            textTranslate={this.state.options.url}
                        >
                            <Button
                                className='folder__btn'
                                buttonType='button'
                                buttonTitle='_SELECT_FILE'
                                onClick={() => this.setState({fileManager: true})}
                            />
                    </Fields>
                    <Translation>{(t) => <p>{t('_OR')}</p>}</Translation>
                    <li className='content-element'>
                        <Button
                            className='main-library'
                            buttonType='button'
                            buttonTitle=''
                            buttonText='_IMG_FREE_LIB'
                            onClick={() => this.props.changeFreeLibrary(true)}
                        />
                    </li>
                    <Translation>{(t) => <p>{t('_IMGR_CAPTION')}</p>}</Translation>
                    <li>
                        <FroalaEditorComponent
                            config={this.state.configFroala}
                            model={this.state.options.text}
                            onModelChange={(model) => this.handleChange(undefined, 'text', undefined, model)}
                        />
                    </li>
                </ul>
            </Fragment>
        )
    }

    Options = () => {
        return(
            <ImgOptions
                scale={this.state.options.scale} 
                scaleChange={(event, target) => this.handleChange(event, target)}
                description={this.state.options.alt} 
                descriptionChange={(event, target) => this.handleChange(event, target)}
                href={this.state.options.href} 
                hrefChange={(event, target) => this.handleChange(event, target)}
            />
        )
    }

    Help = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{t('_IMGR')}</h3>
                        <p>{t('_IMGR_HELP')}</p>
                        <p>{t('_IMG_NB')}</p>
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

export default BlockTextRight

