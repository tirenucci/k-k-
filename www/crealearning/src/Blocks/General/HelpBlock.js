import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaire
import Image from '../../Components/Image'

//Style
import './HelpBlock.scss'


const HelpBlock = ({t}) => {
    return (
        <section className='help__section'>
            <article className='help__article'>
                <h3>{t('_BLOCK_HELP')}</h3>
                <p>
                    {t('_BLOCK_HELP_1')}<b>{t('_BLOCK_HELP_2')}</b>{t('_BLOCK_OR')}<b>{t('_BLOCK_HELP_3')}</b>{t('_BLOCK_HELP_EN')}
                    <br/>
                    {t('_BLOCK_HELP_4')}
                </p>
                <ol>
                    <li>
                        1. <b>{t('_BLOCK_HELP_5')}</b>{t('_BLOCK_HELP_6')}
                    </li>
                    <li>
                        2. {t('_BLOCK_HELP_7')}<b>{t('_BLOCK_HELP_8')}</b>{t('_BLOCK_HELP_9')}
                    </li>
                </ol>
                <p>{t('_BLOCK_HELP_10')}</p>
                <p>{t('_BLOCK_HELP_11')}<b>{t('_BLOCK_HELP_12')}</b>{t('_BLOCK_HELP_13')}</p>
                <p>{t('_BLOCK_HELP_14')}<b>{t('_BLOCK_HELP_15')}</b>{t('_BLOCK_HELP_16')}<Image className='img-inline' src='/assets/img/help/img_add_note.jpg' alt='_NOTE_ICON'/>.<br/>{t('_BLOCK_HELP_17')}</p>
                <p>{t('_BLOCK_HELP_18')}</p>
                <ul>
                    <li>
                        <Image className='img-inline' src='/assets/img/help/img_ico_preview.jpg' alt='_PLAY_ICON'/>{t('_BLOCK_HELP_19')}
                    </li>
                    <li>
                        <Image className='img-inline' src='/assets/img/help/img_ico_duplicate.jpg' alt='_DUPLICATE_ICON'/>{t('_BLOCK_HELP_20')}
                    </li>
                    <li>
                        <Image className='img-inline' src='/assets/img/help/img_ico_configure.jpg' alt='_CONFIG_ICON'/>{t('_BLOCK_HELP_21')}
                    </li>
                    <li>
                        <Image className='img-inline' src='/assets/img/help/img_ico_delete.jpg' alt='_TRASH_ICON'/>{t('_BLOCK_HELP_22')}
                    </li>
                </ul>
                <h4>{t('_BLOCK_HELP_23')}</h4>
                <ul>
                    <li>
                        <b>{t('_BLOCK_HELP_24')}</b>{t('_BLOCK_HELP_25')}
                    </li>
                    <li>
                        <b>{t('_BLOCK_HELP_26')}</b>{t('_BLOCK_HELP_27')}
                    </li>
                    <li>
                        <b>{t('_MIN_DURATION')}</b>{t('_BLOCK_HELP_28')}
                    </li>
                    <li>
                        <b>{t('_MAX_DURATION')}</b>{t('_BLOCK_HELP_29')}
                    </li>
                    <li>
                        <b>{t('_ACTION_TIME_LIMIT')}</b>{t('_BLOCK_HELP_30')}
                    </li>
                    <ul className='circle-list'>
                        <li>
                            <b>{t('_EXIT_NO_MESS')}</b>{t('_BLOCK_HELP_31')}
                        </li>
                        <li>
                            <b>{t('_EXIT_MESS')}</b>{t('_BLOCK_HELP_32')}
                        </li>
                        <li>
                            <b>{t('_CONTINUE_NO_MESS')}</b>{t('_BLOCK_HELP_33')}
                        </li>
                        <li>
                            <b>{t('_CONTINUE_MESS')}</b>{t('_BLOCK_HELP_34')}
                        </li>
                    </ul>
                    <li>
                        <b>{t('_SUCCEED_SCORE')}</b>{t('_BLOCK_HELP_35')}
                    </li>
                    <li>
                        <b>{t('_CONTENT_VALIDATION')}</b>{t('_BLOCK_HELP_36')}
                    </li>
                    <li>
                        <b>{t('_GRAPHIC_VALIDATION')}</b>{t('_BLOCK_HELP_37')}
                    </li>
                    <li>
                        <b>{t('_SHOW_CORRECT_ANSWERS')}</b>{t('_BLOCK_HELP_38')}
                    </li>
                    <li>
                        <b>{t('_TOTAL_NOTE')}</b>{t('_BLOCK_HELP_39')}
                    </li>
                </ul>
                <p>{t('_BLOCK_HELP_40')}</p>
            </article>
        </section>
    )
}

export default withTranslation()(HelpBlock)