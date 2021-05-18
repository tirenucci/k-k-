import React, { Fragment } from 'react'

//i18n
import { Translation } from 'react-i18next'

//Structure
import BlockSkeleton from './BlockSkeleton'
import ContentHelp from './General/ContentHelp'
import OptionsHelp from './General/OptionsHelp'
import ImgOptions from './General/ImgOptions'

//Utilitaires
import Button from '../Components/formWidget/Button'
import Image from '../Components/Image'
import Fields from '../Components/formWidget/Fields'
import FileManagerModal from "../Components/modal/FileManagerModal";

class BlockImage extends BlockSkeleton{

    constructor(props){
        super(props);
        this.state = {
            fileManager: false,
            lang: props.lang,
            disableButton: true,
            position: props.nbBlock,
            type: '_IMG',
            media: true,
            FreeLibrary: false,
            options: {
                scale: 100,
                url: '_UNKNOWN',
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
                { this.state.fileManager ? <FileManagerModal onlyType={'image'} validImage={(url) => this.validImage(url)}  training={this.props.trainingUuid} title={"Bibliothèque"} changeUrl={(url) => this.handleUrlChange(url)} onAnnul={() => this.setState({fileManager: false})} /> : <Fragment /> }
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
                    <p>Ou</p>
                    <li className='content-element'>
                        <Button
                            className='main-library'
                            buttonType='button'
                            buttonText='_IMG_FREE_LIB'
                            onClick={() => this.props.changeFreeLibrary(true)}
                        />
                    </li>
                </ul>
            </Fragment>
        )
    }

    componentWillReceiveProps(newProps){
        if (newProps.changeUrl !== this.props.changeUrl){
            let {options} = this.state
            options.url = newProps.changeUrl
            this.setState({options, disableButton: false})
        }
        if (newProps.image_path !== this.props.image_path){
            let {options} = this.state
            options.url = newProps.image_path
            this.setState({options, disableButton: false})
            this.props.changeFreeLibrary(false)
        }
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
                        <h3>{t('_IMG')}</h3>
                        <ContentHelp>
                            <p>{t('_IMG_HELP_1')}<Image className='img-inline' src='/assets/img/help/img_open_file.jpg' alt='_FILE_ICON'/>{t('_IMG_HELP_2')}</p>
                            <p><b>{t('_IMG_HELP_3')}</b></p>
                            <p>{t('_IMG_HELP_4')}</p>
                            <p><b>{t('_IMG_HELP_5')}</b></p>
                            <p>{t('_DL_HELP')}<Image className='img-inline' src='/assets/img/help/img_upload_file.jpg' alt='_SAVE_ICON'/>{t('_IMG_HELP_7')}</p>
                        </ContentHelp>
                        <OptionsHelp>
                            <p>{t('_IMG_HELP_8')}</p>
                            <ul>
                                <li><b>{t('_DESC_HELP')}</b>{t('_IMG_HELP_10')}</li>
                                <li><b>{t('_IMG_HELP_11')}</b>{t('_IMG_HELP_12')}</li>
                                <li><b>{t('_IMG_HELP_13')}</b>{t('_IMG_HELP_14')}</li>
                            </ul>
                        </OptionsHelp>
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


export default BlockImage