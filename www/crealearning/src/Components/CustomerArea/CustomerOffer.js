import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Components utilitaires
import Button from '../formWidget/Button'
import CustomerContent from './CustomerContent'

const CustomerOffer = ({t, offer, cancelOffer}) => {
    return (
         <CustomerContent
            customerTitle={'_CUSTOMER_TITLE_2'}>
            <ul className='offer__list'>
                <li className='offer-wrapper green-part'>
                    <h4 className='offer'>Pro</h4>
                    <p className='price'>{t('_CUSTOMER_PRICE_PRO_1')}<br/><em>{t('_CUSTOMER_PRICE_PRO_2')}</em></p>                        
                    <ul>
                        <li>{t('_CUSTOMER_OFFER_1')}</li>
                        <li>{t('_CUSTOMER_OFFER_PRIVACY')}</li>
                        <li>{t('_CUSTOMER_OFFER_IMPORT')}</li>
                        <li>{t('_CUSTOMER_OFFER_EXPORT')}</li>
                        <li>{t('_CUSTOMER_OFFER_5')}</li>
                    </ul>
                    {
                        offer === 'pro' ?
                        <Button
                            className='suspend__btn'
                            buttonType='button'
                            buttonText='_SUSPEND_OFFER'
                            onClick={() => cancelOffer()}
                        />
                        :
                        <Button 
                            className='contact__btn'
                            buttonType='button'
                            buttonText='_SUBSCRIBE'
                            onClick={() => window.open('https://open.crea-learning.com/index.php#four', '_blank')}
                        />
                    }
                </li>
                <li className='offer-wrapper orange-part'>
                    <h4 className='offer orange'>{t('_CUSTOMER_ORG')}</h4>
                    <p className='price orange'>{t('_CUSTOMER_PRICE_ORG')}<br/>{t('_CONTACT')}</p>                        
                    <ul>
                        <li>{t('_CUSTOMER_OFFER_6')}</li>
                        <li>{t('_CUSTOMER_OFFER_PRIVACY')}</li>
                        <li>{t('_CUSTOMER_OFFER_IMPORT')}</li>
                        <li>{t('_CUSTOMER_OFFER_EXPORT')}</li>
                        <li>{t('_CUSTOMER_OFFER_10')}</li>
                        <li>{t('_CUSTOMER_OFFER_11')}</li>
                        <li>{t('_CUSTOMER_OFFER_12')}</li>
                        <li>{t('_CUSTOMER_OFFER_13')}</li>
                    </ul>
                        <Button 
                            className='contact__btn'
                            buttonType='button'
                            buttonText='_CONTACT'
                            onClick={() => window.open('https://open.crea-learning.com/contact.php', '_blank')}
                        />
                </li>
            </ul>
        </CustomerContent>
    );
};

export default withTranslation()(CustomerOffer);