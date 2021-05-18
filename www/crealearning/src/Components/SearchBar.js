import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import Button from './formWidget/Button'
import Image from './Image'
import Fields from './formWidget/Fields'
import Option from './html/Option'

//Style
import './SearchBar.scss'

const SearchBar = ({offerFilter,filterStatus, handleSubmit, handleChange, t, additionalClass, filterLabel, placeholder, inputSize, filterOptions, secondFilter, wordSearch, searchButton = true, marginDisable = false}) => {
    return (
        <form onSubmit={(event) => handleSubmit(event)} className={`search__form ${additionalClass} ${!marginDisable ? 'margin__actif': ''}`}>
            <ul>
                <li className='search__bar'>
                    <Image src='/assets/img/trainingsList/ico-search-bleue.png' alt='_LENS'/>
                    <input name='searchRequest' type='text' size={inputSize} placeholder={t(placeholder)} value={wordSearch} onChange={(event, target) => handleChange(event, 'wordSearch')}/>
                </li>
                {
                    filterLabel ?
                    <Fields
                        liClass='search__filter'
                        htmlFor='filter'
                        text={filterLabel}
                        options={filterOptions}
                        onChange={(event) => handleChange(event, "filterStatus")}
                        value={filterStatus}
                    />
                    :
                        <Fragment/>
                }
                {
                    //Le deuxième filtre n'est utile que pour la partie gestion utilisateur
                    secondFilter !== undefined ?
                    <Fields
                        liClass='search__filter'
                        htmlFor='offerFilter' 
                        text='_OFFER'
                    >
                        <select id='offerFilter' name='offerFilter' onChange={(event => handleChange(event, "offerFilter"))} value={offerFilter} defaultValue='_ALL_OFFER'>
                            <Option value='_ALL_OFFER' textTranslate='_ALL_OFFER'/>
                            <Option value='open' textTranslate='_FREE'/>
                            <Option value='pro' textTranslate='_PRO'/>
                            <Option value='org' textTranslate='_PREMIUM'/>
                            <Option value='Logipro' textTranslate='_LOGIPRO'/>
                        </select>
                    </Fields>
                    :
                    <Fragment/>
                }         
                {
                    searchButton ?
                    <li>
                        <Button
                            className='search__btn'
                            buttonText='_SEARCH'
                            buttonType='submit'
                            onClick={()=>{}}
                        />
                    </li>
                    :
                    <Fragment/>
                }
            </ul>
        </form>   
    )
}

export default withTranslation()(SearchBar)