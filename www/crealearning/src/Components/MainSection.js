import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

import Tool from './Tool'
import Image from './Image'

const MainSection = ({additionalClass, additionalTitleClass, children, titleText, value, tools, onClick, width, t, variable}) => {
    return (
        <main id='main'>
            <section className={`main__section ${additionalClass !== undefined ? additionalClass : ''}`}>
                {
                    tools !== undefined ?
                    <div className='tool__box'>
                        {
                            width !== undefined && width < 700 ?
                                <a href='/' id='mobile__logo' title={t('_HOME')}>
                                    <Image src='/assets/img/header/logo.png' alt='_LOGO_CREA'/>
                                </a>
                            :
                                <Fragment/>
                        }
                        <h2 className={`secondary__title ${additionalTitleClass !== undefined ? additionalTitleClass : ''}`}>{t(titleText, {trainingName:value})}</h2>
                        <nav className='tools'>
                            {
                                width !== undefined && width < 700 ?
                                <li className='mobile'>
                                    <a href='#link' id='mobile-link'></a> 
                                    <ul>
                                        {
                                            tools instanceof Array ?
                                                tools.map((tool, key) => (
                                                    <Tool
                                                        key={key}
                                                        type={tool.type}
                                                        link={tool.link.replace('***', variable)}
                                                        title={tool.title}
                                                        text={tool.text}
                                                        onClick={onClick}
                                                        target={tool.target}
                                                        rel={tool.rel}
                                                    />
                                                ))
                                            :
                                                <Fragment/>
                                        }
                                    </ul>
                                </li>
                                :
                                <ul>
                                    {
                                        tools instanceof Array ?
                                            tools.map((tool, key) => (
                                                <Tool
                                                    key={key}
                                                    type={tool.type}
                                                    link={tool.link.replace('***', variable)}
                                                    title={tool.title}
                                                    text={tool.text}
                                                    onClick={onClick}
                                                    target={tool.target}
                                                    rel={tool.rel}
                                                />
                                            ))
                                        :
                                            <Fragment/>
                                    }
                                </ul>
                            }
                        </nav>
                    </div>
                    :
                    <h2 className={`secondary__title ${additionalTitleClass !== undefined ? additionalTitleClass : ''}`}>{t(titleText, {user:value})}</h2>
                }
                {children}
            </section>
        </main>
    )
}

export default withTranslation()(MainSection)