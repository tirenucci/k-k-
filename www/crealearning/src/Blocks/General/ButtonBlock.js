import React, { Fragment } from 'react'

import { withTranslation } from 'react-i18next'

import './ButtonBlock.scss'

const ButtonBlock = ({blocks, onDoubleClick, onClick, id, t}) => {
    
    const dragStart = (event, block) => {
        event.dataTransfer.setData('block', block)
    }

    const dragOver = event => {
        event.stopPropagation()
    }

    return (
        <Fragment>
            {
                blocks instanceof Array ?
                blocks.map((block, key) => (
                    <li className={t('_CSS_BLOCK')} key={key}>
                        <div 
                            id={id}
                            className={'button-block ' + block.style}
                            type='button'
                            title={t(block.title)}
                            onDoubleClick={(event, target) => onDoubleClick(event, block.type)}
                            onClick={(event, target) => onClick(event, block.type)}
                            draggable='true'
                            onDragStart={(e, b) => dragStart(e, block.type)}
                            onDragOver={dragOver}
                            >
                            <p>{t(block.text)}</p>
                        </div>
                    </li>
                ))
                : <Fragment />
            }
        </Fragment>
    )
}

export default withTranslation()(ButtonBlock)