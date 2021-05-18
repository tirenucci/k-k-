import React, {Fragment} from 'react'
import htmlParse from 'html-react-parser'

import Button from '../formWidget/Button'

//Style
import './BlockHtmlContainer.scss'

const BlockHtmlContainer = ({html, keyProps, onclick, selected, onDeleteBlock, openSender, duplicateBlock, dragOverBlock, dragExit, onDrop, lang, getLang, is_editor}) => {


    const getLanguage = (lang, key) => {
        getLang(lang, key)
    }

    return(
        <Fragment>
            {
                is_editor !== undefined && is_editor ?
                    <Fragment>
                        {
                            keyProps === 0 ?
                                <div className='dragover' id={keyProps} onDragOver={(e) => dragOverBlock(e)} style={{height: '40px', position:'absolute', zIndex:'1', width: '100%'}} onDragLeave={(e) => dragExit(e)} onDrop={(e, position) => onDrop(e, keyProps)} />
                                :
                                <Fragment />
                        }

                        <li onClick={(event, id) => onclick(event, html.id, html.type)} id={`block_${html.id}`} className={`cle-block-list block ${selected}`}>
                            <ul className='btn-block-list' data-cy='btn-block-list'>
                                <li>
                                    <Button
                                        className='btn-block send-to'
                                        buttonType='button'
                                        buttonTitle='_SEND_GRAIN'
                                        buttonText='_SEND_GRAIN'
                                        onClick={() => openSender()}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='btn-block duplicate'
                                        buttonType='button'
                                        buttonTitle='_DUPLICATE'
                                        buttonText='_DUPLICATE'
                                        onClick={() => duplicateBlock()}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='btn-block delete'
                                        buttonType='button'
                                        buttonTitle='_DELETE'
                                        buttonText='_DELETE'
                                        onClick={() => onDeleteBlock()}
                                    />
                                </li>
                            </ul>
                            {
                                html.lang !== lang ?
                                    <Fragment>
                                        {html.language_use === undefined ? getLanguage(html.lang, keyProps) : <Fragment />}
                                        {htmlParse(html.language_use + ' ' + html.htmlCode.replace(/[\u200B-\u200D\uFEFF]/g, ''))}
                                    </Fragment>
                                    :
                                    <Fragment>{htmlParse(html.htmlCode.replace(/[\u200B-\u200D\uFEFF]/g, ''))}</Fragment>
                            }
                        </li>
                        <div className='dragover' id={keyProps + 1} onDragOver={(e) => dragOverBlock(e)} style={{height: '10px', position:'absolute', zIndex:'1', width: '100%'}} onDragLeave={(e) => dragExit(e)} onDrop={(e, position) => onDrop(e, keyProps + 1)} />
                    </Fragment>
                    :

                    <Fragment>
                        <div className='dragover' id={keyProps} onDragOver={(e) => dragOverBlock(e)} style={{height: '10px', position:'absolute', zIndex:'1', width: '100%'}} onDragLeave={(e) => dragExit(e)}  onDrop={(e, position) => onDrop(e, keyProps)} />
                        <li onClick={(event, id) => onclick(event, html.id, html.type)} id={`block_${html.id}`} className={`cle-block-list block ${selected}`}>
                            {
                                html.lang !== lang ?
                                    <Fragment>
                                        {html.language_use === undefined ? getLanguage(html.lang, keyProps) : <Fragment />}
                                        {htmlParse(html.language_use + ' ' + html.htmlCode.replace(/[\u200B-\u200D\uFEFF]/g, ''))}
                                    </Fragment>
                                    :
                                    <Fragment>{htmlParse(html.htmlCode.replace(/[\u200B-\u200D\uFEFF]/g, ''))}</Fragment>
                            }
                        </li>
                        <div className='dragover' id={keyProps} onDragOver={(e) => dragOverBlock(e)} style={{height: '40px', position:'absolute', zIndex:'1', width: '100%'}} onDragLeave={(e) => dragExit(e)} onDrop={(e, position) => onDrop(e, keyProps + 1)} />
                    </Fragment>
            }

        </Fragment>
    )
}

export default BlockHtmlContainer