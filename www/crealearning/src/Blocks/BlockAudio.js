import React, {Fragment} from 'react'

//i18n
import { Translation } from 'react-i18next'

//Structure
import BlockSkeleton from './BlockSkeleton'
import OptionsHelp from './General/OptionsHelp'
import ContentHelp from './General/ContentHelp'

//Utilitaires
import Button from '../Components/formWidget/Button'
import Fields from '../Components/formWidget/Fields'
import FilenameModal from '../Components/modal/FilenameModal'
import FileManagerModal from "../Components/modal/FileManagerModal";
import {fetchApi} from "../Utils/Fetch";

class BlockAudio extends BlockSkeleton{
    
    constructor(props){
        super(props);
        this.state = {
            lang: props.lang,
            fileManager: false,
            position: props.nbBlock,
            disableButton: true,
            record: false,
            modal: false,
            name: '',
            type: '_AUDIO',
            media: true,
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

    componentDidMount = async() => {
        super.componentDidMount()
        if (this.props.id_block !== undefined)
        {
            await this.getBlockContent()
        }
        else
        {
            await this.sendBlockToBack()
        }
    }

    validImage(url) {
        let {options} = this.state

        options.url = url.replace('//', '/')


        this.setState({options, fileManager: false, disableButton: false})
    }

    async upload(audio){
        let formData = new FormData()
        formData.append('media', audio)
        formData.append('name', this.state.name + '.mp3')
        formData.append('id_grain', this.props.id_grain)
        let response = await fetchApi('media/upload', 'POST', true, formData, false)

        if (response){
            let data = await response
            let {options} = this.state
            options.url = data['media']
            this.setState({options, disableButton: false})
        }
    }

    async startRecording(stream) {
        let recorder = new MediaRecorder(stream)
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

    record(){
        let constraints = {audio: true};

        this.setState({modal: false})
        let block = document.getElementById('block_' + this.props.id_block)
        let video = block.querySelector('audio')
        window.navigator.mediaDevices.getUserMedia(constraints).then(stream => {
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
            let video = block.querySelector('audio')
            video.src = URL.createObjectURL(recordedBlob)

            this.upload(recordedBlob)
        })
        .catch((err) => {
            console.log(err.name + ': ' + err.message)
        })
    }

    stop(){
        
        let block = document.getElementById('block_' + this.props.id_block)
        let video = block.querySelector('audio')

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

    wait(delayInMS) {
        return new Promise(resolve => setTimeout(resolve, delayInMS));
    }

    beginRecord(){
        let date = new Date()
        let name = date.getFullYear() + '' + date.getMonth() + '' + date.getDate() + '_' + Math.floor(Math.random() * (10000-1000) + 1000)
        this.setState({name, modal: true})
    }
    Content = () => {
        return(
            <Fragment>
                { this.state.fileManager ? <FileManagerModal onlyType={'audio'} validImage={(url) => this.validImage(url)}  training={this.props.trainingUuid} title={"Bibliothèque"} changeUrl={(url) => this.handleUrlChange(url)} onAnnul={() => this.setState({fileManager: false})} /> : <Fragment /> }
                <ul className='content-list'>
                {
                    this.state.modal ? <FilenameModal name={this.state.name} onAnnul={() => this.setState({modal: false})} change={(event) => this.changeName(event)} onOk={() => this.record()} /> : <Fragment />
                }
                    <Fields
                        liClass='content-element wrap'
                        inputType='text'
                        htmlFor='source'
                        text='_AUDIO_SOURCE'
                        textTranslate={this.state.options.url}
                    >
                        <Button
                            className='folder__btn'
                            buttonType='button'
                            buttonTitle='_SELECT_FILE'
                            onClick={() => this.setState({fileManager: true})}
                        />
                    </Fields>
                    <li className='content-element'>
                    <div className='media-wrapper'>
                        <Translation>{(t) => <p>{t('_AUDIO_RECORDER')}</p>}</Translation>
                        <ul className='media-btn-wrapper'>
                            <li><button className={`${this.state.record ? 'record-rec-btn' : 'record-btn'}`} onClick={this.state.record ? () => this.stop() : () => this.beginRecord()}/></li>
                        </ul>
                        <audio src={this.state.options.url} controls autoplay loop />
                    </div>
                    </li>
                </ul>
            </Fragment>
        )
    }

    Options = () => {
        return(
            <Fragment>
                <Fields htmlFor='autoPlay' text='_AUTOPLAY' inputType='checkbox' liClass='checkbox'/>
                <Fields liClass='option-element' htmlFor='description' text='_DESCRIPTION' inputType='text' value={this.state.options.alt} onChange={(event, target) => this.handleChange(event, 'alt')}/>
            </Fragment>
        )
    }

    Help = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{t('_AUDIO')}</h3>
                        <ContentHelp>
                            <ul>
                                <li>
                                    <b>{t('_AUDIO_HELP_1')}</b><br/>
                                    {t('_AUDIO_HELP_2')}
                                </li>
                                <li>
                                    <b>{t('_AUDIO_HELP_3')}</b><br/>
                                    {t('_AUDIO_HELP_4')}
                                </li>
                            </ul>
                        </ContentHelp>
                        <OptionsHelp>
                            <p>{t('_SET_OPTIONS')}</p>
                            <ul>
                                <li><b>{t('_CONVERT')}</b>
                                    <p>{t('_SCREEN_AND_AUDIO_HELP')}</p>
                                    <div className='highlight'>
                                        <p>{t('_ABOUT')}<b>{t('_AUDIO_HELP_5')}</b></p>
                                        <ul className='circle-list'>
                                            <li>MP4: IE, Firefox, Chrome, Safari</li>
                                            <li>OGG: Firefox, Chrome, Opera</li>
                                            <li>WEBM: Firefox, Chrome, Opera</li>
                                        </ul>        
                                    </div>
                                </li>
                                <br/>
                                <li>{t('_DEFINE')}<b>{t('_A_DESCRIPTION')}</b>{t('_AUDIO_HELP_6')}</li>
                                <li>{t('_AUTOPLAY_1')}<b>{t('_AUTOPLAY')}</b>{t('_AUDIO_HELP_7')}</li>
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

export default BlockAudio