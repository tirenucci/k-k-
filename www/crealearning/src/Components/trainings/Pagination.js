import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './Pagination.scss'

const Pagination = ({t, page, currentPage, count, nextClick, lastClick, previousClick, firstClick, maxElement, choicePage}) => {
    let pages = []

    for (let i = 0; i <= page - 1; i++){
        if (i > currentPage - 5 && i < currentPage + 5) {
            if (i === currentPage){
                pages.push(<li key={i}><strong>{i + 1}</strong></li>)
            } else {
                pages.push(<li key={i}><button onClick={(event) => choicePage(event, i)}>{i + 1}</button></li>)
            }
        }
    }

    return (
        //Bug à voir ensemble
        <nav className='pagination'>
            <ul title='Pages'>
                {
                    currentPage > 0 ?
                        <Fragment>
                            <li>
                                <a href='#first' onClick={firstClick} title={t('_FIRST_PAGE')} className='last-page'>&lt;&lt;</a>
                            </li>
                            <li>
                                <a href='#previous' onClick={previousClick} title={t('_PREVIOUS_PAGE')} className='next-page'>&lt;</a>
                            </li>
                        </Fragment>
                    :
                        <Fragment />
                }
                {pages}
                {
                    page === currentPage ? 
                        <Fragment/> 
                    :
                        <Fragment>
                            <li>
                                <a href='#next' onClick={nextClick} title={t('_NEXT_PAGE')} className='next-page'>&gt;</a>
                            </li>
                            <li>
                                <a href='#last' onClick={lastClick} title={t('_LAST_PAGE')} className='last-page'>&gt;&gt;</a>
                            </li>
                        </Fragment>
                }
            </ul>
            {
                count < maxElement ?
                    <p>{t('_PAGE_RESULT', {count : count})}</p>
                :
                (currentPage + 1) * maxElement > count ?
                    <p>{t('_PAGE_RESULTS', {count : count, currentPage: currentPage * maxElement})}</p>
                :
                    <p>{t('_PAGE_RESULTS_2', {count : count, currentPage: currentPage * maxElement + 1, currentPage2: currentPage * maxElement + maxElement})}</p>
            }
        </nav>
    )
}

export default withTranslation()(Pagination)