import React, {Fragment} from 'react'

import hmacSHA256 from 'crypto-js/hmac-sha256'

//i18n
import { Translation } from 'react-i18next'

//Structure
import BlockSkeleton from './BlockSkeleton'
import OptionsHelp from './General/OptionsHelp'
import ContentHelp from './General/ContentHelp'

//Utilitaires
import Button from '../Components/formWidget/Button'
import FilenameModal from '../Components/modal/FilenameModal'
import FileManagerModal from "../Components/modal/FileManagerModal";
import EditVideoModal from '../Components/modal/EditVideoModal'
import Loader from '../Components/modal/Loader'
import Image from '../Components/Image'
import Fields from '../Components/formWidget/Fields'
import {fetchApi} from "../Utils/Fetch";

class BlockScreenShot extends BlockSkeleton{

    constructor(props){
        super(props);
        this.state = {
            lang: props.lang,
            fileManager: false,
            position: props.nbBlock,
            media: true,
            disableButton: true,
            record: false,
            modal: false,
            name :'',
            type: '_SCREEN',
            options: {
                url: '_UNKNOWN',
                alt: '',
                height: '',
                width: '',
                autoplay: '',
                chrome_download: 'nodownload',
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

    record(){
        this.setState({modal: false})
        let constraints = {audio: true, video: {width: 1920, height: 1080}};
        let block = document.getElementById('block_' + this.props.id_block)
        let video = block.querySelector('video')
        window.navigator.mediaDevices.getDisplayMedia(constraints).then(stream => {
            video.srcObject = stream
            video.onloadedmetadata = function(e){
                video.play()
            }
            video.captureScreen = video.captureScreen || video.mozCaptureStream
            this.setState({record: true})
            return new Promise(resolve => video.onplaying = resolve)
        }).then(() => this.startRecording(video.srcObject)).then(recordedChunck => {
            let recordedBlob = new Blob(recordedChunck, {type: 'video/webm'})
            
            let block = document.getElementById('block_' + this.props.id_block)
            let video = block.querySelector('video')
            video.src = URL.createObjectURL(recordedBlob)

            this.upload(recordedBlob)
        })
        .catch((err) => {
            console.log(err.name + ': ' + err.message)
        })
    }

    wait(delayInMS) {
        return new Promise(resolve => setTimeout(resolve, delayInMS));
    }

    async startRecording(stream) {
        let recorder = new MediaRecorder(stream, {bitsPerSecond: 128000})
        let data = []
        recorder.ondataavailable = event => data.push(event.data)
        recorder.start()

        let stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve
            recorder.onerror = event => reject(event.name)
        })

        return Promise.all([
            stopped,
            recorder
        ]).then(() => data)
    }

    async upload(video){
        let formData = new FormData()
        formData.append('media', video)
        formData.append('name', this.state.name + '.webm')
        formData.append('id_grain', this.props.id_grain)
        let response = await fetchApi('media/upload', 'POST', true, formData, false)

        if (response){
            let data = await response
            let {options} = this.state
            options.url = data.media
            this.setState({options, disableButton: false})
        }
    }


    async convert(){
        this.setState({loading: true})
        let response = await fetchApi('media/convert', 'POST',true, {
            url: this.state.options.url
        })

        if (response) {
            await response
            let {options} = this.state
            options.url = this.state.options.url.replace('.webm', '.mp4')
            await this.setState({loading: false, options, disableButton: false})
        }
    }

    stop(){
        
        let block = document.getElementById('block_' + this.props.id_block)
        let video = block.querySelector('video')

        let tracks = video.srcObject.getTracks();

        tracks.forEach(track => track.stop())
        this.setState({record: false})
        
        let recorder = new MediaRecorder(video.srcObject)
        let data = []
        recorder.ondataavailable = event => data.push(event.data)

        let stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve
            recorder.onerror = event => reject(event.name)
        })

        let recorded = this.wait(100).then(
            () => recorder.state === 'recording' && recorder.stop()
        );

        return Promise.all([
            stopped,
            recorder
        ]).then(() => data)
    }

    changeName(event){
        const name = event.target.value
        this.setState({name})
    }

    beginRecord(){
        let date = new Date()
        let name = date.getFullYear() + '' + date.getMonth() + '' + date.getDate() + '_' + Math.floor(Math.random() * (10000-1000) + 1000)
        this.setState({name, modal: true})
    }

    Content = () => {
        return(
            <Fragment>
                { this.state.fileManager ? <FileManagerModal onlyType={'video'} validImage={(url) => this.validImage(url)}  training={this.props.trainingUuid} title={"Bibliothèque"} changeUrl={(url) => this.handleUrlChange(url)} onAnnul={() => this.setState({fileManager: false})} /> : <Fragment /> }

                <ul className='content-list'>
            {
                this.state.modal ? <FilenameModal name={this.state.name} onAnnul={() => this.setState({modal: false})} change={(event) => this.changeName(event)} onOk={() => this.record()} /> : <Fragment />
            }
                <Fields
                    liClass='content-element wrap'
                    inputType='text'
                    htmlFor='source' 
                    text='_VIDEO_SOURCE'
                    textTranslate={this.state.options.url}
                >
                    <Button
                        className='folder__btn'
                        buttonType='button'
                        buttonTitle='_SELECT_FILE'
                        onClick={() => this.setState({fileManager: true})}
                    />
                </Fields>

                    {
                        this.state.options.url.split('.').pop() === "webm" ?
                            <Translation>
                                {
                                    (t) =>
                                        <p className={"error_message__extension"}>{t("_CLE_BLOCK_VIDEO_EXTENSION_ALERT")} <a onClick={() => this.changeTabs()}>{t("_HERE")}</a></p>
                                }
                            </Translation>
                            :
                            <Fragment />
                    }
                <li className='content-element'>
                    <div className='media-wrapper'>
                        <ul className='media-btn-wrapper'>
                            <li><button className={`${this.state.record ? 'record-rec-btn' : 'record-btn'}`} onClick={this.state.record ? () => this.stop() : () => this.beginRecord()}/></li>
                        </ul>
                        <video src={this.state.url} controls autoplay loop />
                    </div>
                </li>
            </ul>
        </Fragment>
        )
    }

    Options = () => {
        return(
            <ul className='checkbox-section'> 
                {
                    this.state.edit ? 
                        <EditVideoModal videoUrl={this.state.options.url} onAnnul={() => this.setState({edit: false})}/>
                    : this.state.loading ? 
                        <Loader/> 
                    : <Fragment/>
                }
                {
                    //A compléter pas de onChange sur checkbox ?
                }
                <Fields
                    liClass='checkbox'
                    htmlFor='autoplay' 
                    text='_AUTOPLAY'
                    inputType='checkbox'
                />
                <Fields
                    liClass='checkbox'
                    htmlFor='downloadRight' 
                    text='_VIDEO_DL'
                    inputType='checkbox'
                />
                <Fields
                    liClass='option-element'
                    htmlFor='description' 
                    text='_DESCRIPTION'
                    inputType='text'
                    value={this.state.options.alt} 
                    onChange={(event, target) => this.handleChange(event, 'alt')}
                />
                <li>
                    <ul className='one__row'>
                        <Fields
                            liClass='option-element'
                            htmlFor='width' 
                            text='_WIDTH'
                            inputType='text'
                            value={this.state.options.width} 
                            onChange={(event, target) => this.handleChange(event, 'width')}
                        >
                            &nbsp;px
                        </Fields>
                        <Fields
                            liClass='option-element'
                            htmlFor='height' 
                            text='_HEIGHT'
                            inputType='text'
                            value={this.state.options.height} 
                            onChange={(event, target) => this.handleChange(event, 'height')}
                        >
                            &nbsp;px
                        </Fields>
                    </ul>
                </li>
                {
                    this.state.options.url !== undefined && this.state.options.url !== 'unknown' ?
                        <ul className='video__btn__list'>
                            <li>
                                <Button className='orange__btn' buttonText='_VIDEO_TRIM' onClick={() => this.setState({edit: true})}/>
                            </li>
                            {
                                !this.state.options.url.endsWith('.mp4') ?
                                    <li>
                                        <Button className='orange__btn' buttonText='_CONVERT_MP4' onClick={() => this.convert()}/>
                                    </li>
                                :
                                    <Fragment/>
                            }
                        </ul>
                    :
                        <Fragment/>
                }
            </ul>
        )
    }

    Help = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{t('_SCREEN')}</h3>
                        <ContentHelp>
                            <ul>
                                <li>
                                    <b>{t('_SCREEN_HELP_1')}</b><br/>
                                    {t('_SCREEN_HELP_2')}
                                    <p>{t('_SCREEN_HELP_3')}<Image className='img-inline' src='/assets/img/help/btn-start.png' alt='_PLAY_ICON'/>{t('_SCREEN_HELP_4')}</p>
                                    <p>{t('_SCREEN_HELP_5')}</p>
                                </li>
                            </ul>
                        </ContentHelp>
                        <OptionsHelp>
                            <p>{t('_SET_OPTIONS')}</p>
                            <ul>
                                <li><b>{t('_CONVERT')}</b>
                                    <p>{t('_SCREEN_AND_AUDIO_HELP')}</p>
                                    <div className='highlight'>
                                        <p>{t('_ABOUT')}<b>{t('_FORMATS_SUPPORTED')}</b></p>
                                        <ul className='circle-list'>
                                            <li>MP4: IE, Firefox, Chrome, Safari</li>
                                            <li>OGG: Firefox, Chrome, Opera</li>
                                            <li>WEBM: Firefox, Chrome, Opera</li>
                                            <li>{t('_SWF_PLUGIN')}<a href='https://get.adobe.com/flashplayer/' target='_blank' rel='noopener noreferrer'></a></li>
                                        </ul>        
                                    </div>
                                </li>
                                <br/>
                                <li>{t('_DEFINE')}<b>{t('_A_DESCRIPTION')}</b>{t('_VIDEO_HOVER')}</li>
                                <li>{t('_AUTOPLAY_1')}<b>{t('_AUTOPLAY')}</b>{t('_AUTOPLAY_VIDEO')}</li>
                                <li>{t('_VIDEO_BORDER')}</li>
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

export default BlockScreenShot