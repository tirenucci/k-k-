import React, {Fragment} from 'react'

//i18n
import { Translation } from 'react-i18next'

//Utilitaires
import BlockSkeleton from './BlockSkeleton'
import Button from './../Components/formWidget/Button'
import Fields from '../Components/formWidget/Fields'
import Image from '../Components/Image'
import FileManagerModal from "../Components/modal/FileManagerModal";

class BlockParagraph extends BlockSkeleton{

    constructor(props){
        super(props);
        this.state = {
            fileManager: false,
            lang: props.lang,
            media: true,
            disableButton: true,
            position: props.nbBlock,
            type: '_DOC',
            options: {
                url: '',
                alt: '',
                similar: false
            },
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
                { this.state.fileManager ? <FileManagerModal onlyType={'null'} validImage={(url) => this.validImage(url)}  training={this.props.trainingUuid} title={"Bibliothèque"} onAnnul={() => this.setState({fileManager: false})} /> : <Fragment /> }
                <ul className='content-list'>
                    <Fields
                        liClass='content-element wrap'
                        inputType='text'
                        htmlFor='source'
                        text='_DOC_SOURCE'
                        value={this.state.options.url}
                    >
                        <Button
                            className='folder__btn'
                            buttonType='button'
                            buttonTitle='_SELECT_FILE'
                            onClick={() => this.setState({fileManager: true})}
                        />
                    </Fields>
                    <Fields liClass='content-element' htmlFor='description' text='_DESCRIPTION' inputType='text' value={this.state.options.alt} onChange={(event, target) => this.handleChange(event, 'alt')}/>
                </ul>
            </Fragment>
        )
    }

    Options = () => {}

    Help = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{t('_DOC')}</h3>
                        <p>{t('_DOC_HELP_1')}<Image className='img-inline' src='/assets/img/help/img_open_file.jpg' alt='_FILE_ICON'/>{t('_DOC_HELP_2')}</p>
                        <p><b>{t('_DOC_HELP_3')}</b></p>
                        <p>{t('_DOC_HELP_4')}</p>
                        <p><b>{t('_DOC_HELP_5')}</b></p>
                        <p>{t('_DL_HELP')}<Image className='img-inline' src='/assets/img/help/img_upload_file.jpg' alt='_DL_ICON'/>{t('_DOC_HELP_6')}</p>
                        <p>{t('_DOC_HELP_7')}</p>
                        <li><b>{t('_DESC_HELP')}</b></li>
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