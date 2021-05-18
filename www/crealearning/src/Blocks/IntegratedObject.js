import React from 'react';

//I18n
import { withTranslation } from 'react-i18next'

const IntegratedObject = ({srcImg, altText, link, title, description, t}) => {
    return (
        <li className='integrated-object'>
            <figure>
                <img src={srcImg} alt={altText}/>
                <figcaption>
                    <a href={link} target='_blank' rel='noopener noreferrer'>
                        <h5>{title}</h5>
                    </a>
                    {(t) => t(description)}
                </figcaption>
            </figure>
        </li>
    );
};

export default withTranslation()(IntegratedObject);