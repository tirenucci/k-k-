import React, { Fragment } from 'react'

import { withTranslation } from 'react-i18next'

import './ButtonBlock.scss'

const QuestionBlock = ({questionBlocks, onDoubleClick, onClick, id, t}) => {
    
    const dragStart = (event, block) => {
        event.dataTransfer.setData('block', block)
    }

    const dragOver = event => {
        event.stopPropagation()
    }

    return (
        <Fragment>
            {
                questionBlocks instanceof Array ?
                    questionBlocks.map((question, key) => (
                        <li className='button-container' key={key}>
                            <div 
                                id={id}
                                className={'button-block ' + question.style}
                                type='button'
                                title={t(question.title)}
                                onDoubleClick={(event, target) => onDoubleClick(event, question.type)}
                                onClick={(event, target) => onClick(event, question.type)}
                                draggable='true'
                                onDragStart={(e, b) => dragStart(e, question.type)}
                                onDragOver={dragOver}
                                >
                                <p>{t(question.text)}</p>
                            </div>
                        </li>
                    ))
                : <Fragment />
            }
        </Fragment>
    );
};

export default withTranslation()(QuestionBlock);