import React from 'react'

//Utilitaires
import Image from '../Image'
import Button from '../formWidget/Button'

const SkinPreview = ({onAnnul, src}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <figure>
                    <Image src={src} alt='_SKIN_PREVIEW'/>
                </figure>
                <Button
                    className='grey__btn'
                    type='button'
                    buttonText='_CLOSE_WINDOW'
                    onClick={(event) => onAnnul(event)}
                />
            </section>
        </div>
    );
};

export default SkinPreview