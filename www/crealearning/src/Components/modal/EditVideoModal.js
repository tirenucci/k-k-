import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

import Loader from './Loader'
import Button from '../formWidget/Button'
import Image from '../Image'

//Style
import './EditVideoModal.scss'
import {fetchApi} from "../../Utils/Fetch";

const EditVideoModal = ({onAnnul, t, videoUrl, id_grain}) => {
    
    const [value, setValue] = React.useState({min: 0, max: 100})
    
    const [loading, setLoading] = React.useState(false)

    const handleChange = (event, newValue) => {
        if (document.getElementsByClassName('modal__video')[0] !== undefined && value.min !== newValue.min) {
            document.getElementsByClassName('modal__video')[0].currentTime = newValue.min
        } else if(document.getElementsByClassName('modal__video')[0] !== undefined && value.max !== newValue.max) {
            document.body.onmouseup = async function() {
                let response = await fetchApi(`media/frame?url=${videoUrl}&time=${newValue.max}`, 'GET')

                if (response){
                    let data = await response
                    document.querySelector('.modal__img').src = data.image
                }
            }
        }
        setValue(newValue)
    }

    if (document.getElementsByClassName('modal__video')[0] !== undefined) {
        document.getElementsByClassName('modal__video')[0].addEventListener('loadedmetadata',(e) => {
            setValue({min:0, max: Math.round(document.getElementsByClassName('modal__video')[0].duration)})
        })
    }

    async function editVideo(){
        setLoading(true)
        let response = await fetchApi('media/video/trim', 'PUT', true,{
            url: videoUrl,
            begin: value.min,
            end: value.max,
            id_grain: id_grain
        })


        if (response){
            onAnnul()
            setLoading(false)
        }
    }

    return(
        <div className='modal__wrapper'>
        {
            loading ? <Loader/>:<Fragment/>
        }
            <section className='modal__section section__video'>
                <section className='title section_modal_title'>
                    <h2 className='modal-h2'></h2>
                    <Button
                        className='close__btn'
                        buttonType='button'
                        buttonTitle='_CLOSE'
                        onClick={() => onAnnul(t('_CANCEL_MESSAGE'))}
                    />
                </section>
                <article className='body'>
                    <li className='modal_video'>
                        <video className='modal__video' controls webkit-playsinline playsinline src={videoUrl} preload=''>
                            <source id='source_27688' src={videoUrl} />
                        </video>
                        <Image className='modal__img' alt='_VIDEO_LAST'/>
                    </li>
                    <li>
                        <div id='v_time-container'>
                            <div id='time-range'>
                                {/**<InputRange
                                    maxValue={document.getElementsByClassName('modal__video')[0] !== undefined ? document.getElementsByClassName('modal__video')[0].duration : 0}
                                    minValue={0}
                                    value={value}
                                    onChange={v => handleChange(null, v)}
                                />**/}
                            </div>
                        </div>
                    </li>
                    <p className='modal_text_time'>{t('_VIDEO_START')}<span className='modal_video_time'>{new Date(value.min * 1000).toISOString().substr(11,8)}</span></p>
                    <p className='modal_text_time'>{t('_VIDEO_STOP')}<span className='modal_video_time'>{new Date(value.max * 1000).toISOString().substr(11,8)}</span></p>
                </article>
                    <hr />
                <section className='modal-button'>
                    <Button
                        className='orange__btn'
                        buttonType='button'
                        onClick={(event) => editVideo(event)}
                        buttonText='_OK'
                    />
                    <Button
                        className='grey__btn'
                        buttonType='button'
                        onClick={() => onAnnul(t('_CANCEL_MESSAGE'))}
                        buttonText='_CANCEL'
                    />
                </section>
            </section>
        </div>
    )
}


export default withTranslation()(EditVideoModal)