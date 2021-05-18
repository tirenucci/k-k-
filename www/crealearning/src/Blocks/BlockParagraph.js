import React, {Fragment} from 'react'
import BlockSkeleton from './BlockSkeleton';

import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_editor.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/languages/fr.js'
import 'froala-editor/js/third_party/image_tui.min.js';
import 'froala-editor/js/third_party/embedly.min.js';
import 'froala-editor/js/third_party/spell_checker.min.js';

import {Translation} from "react-i18next";

import ContentHelp from './General/ContentHelp'

import hmacSHA256 from 'crypto-js/hmac-sha256'

class BlockParagraph extends BlockSkeleton{

    constructor(props){
        
        super(props);
        this.state = {
            lang: props.lang,
            position: props.nbBlock,
            disableButton: true,
            type: '_TEXT',
            options: {
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
                //htmlExecuteScripts: true,
                //iframe: true,
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

    Content = () => {
        return(
                <FroalaEditorComponent
                    config={this.state.configFroala}
                    model={this.state.options.text}
                    onModelChange={(model) => this.handleChange(undefined, 'text', undefined, model)}
                />
        )
    }

    Options = () => {
        
    }

    Help = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{t('_TEXT')}</h3>
                        <ContentHelp>
                            <p>{t('_TEXT_HELP_1')}</p>
                            <ul>
                                <li>{t('_TEXT')}</li>
                                <li>{t('_IMG')}</li>
                                <li>{t('_TABLE')}</li>
                                <li>{t('_HYPERLINK')}</li>
                            </ul>
                            <p>{t('_TEXT_HELP_2')}</p>
                            <p>{t('_NB')}</p>
                        </ContentHelp>
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

export default BlockParagraph