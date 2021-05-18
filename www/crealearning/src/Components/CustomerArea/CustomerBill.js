import React from 'react'
import { withTranslation } from 'react-i18next'

import CustomerContent from './CustomerContent'
import Button from '../formWidget/Button'

const CustomerBill = ({t}) => {
    return (
        <CustomerContent
            customerTitle={'_CUSTOMER_TITLE_4'}>
            <p className='customer__help'>{t('_CUSTOMER_BILL_DESCRIPTION')}</p>
            <p className='bill-warning'><span>{t('_CUSTOMER_WARN_1')}</span>{t('_CUSTOMER_WARN_2')}</p>
            <form className='customer-data'>
                <fieldset>
                    <legend>{t('_CUSTOMER_INFO')}</legend>
                    <ul>
                        <li>
                            <label htmlFor='gender'>{t('_GENDER')}</label>
                            <select name='gender' id='gender'>
                                <option value='male'>{t('_MALE')}</option>
                                <option value='female'>{t('_FEMALE')}</option>
                            </select>
                        </li>
                    </ul>
                    <ul className='group-input'>
                        <li>
                            <label htmlFor='userName'>{t('_CUSTOMER_USERNAME')}</label>
                            <input type='text' name='userName' id='userName'/>
                        </li>
                        <li>
                            <label htmlFor='companyName'>{t('_CUSTOMER_COMPANY_NAME')}</label>
                            <input type='text' name='companyName' id='companyName'/>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <label htmlFor='address'>{t('_ADDRESS')}</label>
                            <input type='text' name='adress' id='address'/>
                        </li>
                        <li>
                            <label htmlFor='addressPlus'>{t('_CUSTOMER_ADRESS_COMP')}</label>
                            <input type='text' name='addressPlus' id='addressPlus'/>
                        </li>
                    </ul>
                    <ul className='group-input'>
                        <li>
                            <label htmlFor='zip'>{t('_CUSTOMER_ZIP')}</label>
                            <input type='text' name='zip' id='zip'/>
                        </li>
                        <li>
                            <label htmlFor='city'>{t('_CUSTOMER_CITY')}</label>
                            <input type='text' name='city' id='city'/>
                        </li>
                    </ul>
                    <ul>    
                        <li>
                            <label htmlFor='phone'>{t('_CUSTOMER_PHONE')}</label>
                            <input type='text' name='phone' id='phone'/>
                        </li>
                    </ul>
                    <span className='required'>{t('_CUSTOMER_INFO_REQ')}</span>
                    <Button
                        className='orange__btn'
                        type='button'
                        buttonText='_SAVE'
                        onClick={() => {}}
                    />
                </fieldset>
            </form>
        </CustomerContent>
    );
};

export default withTranslation()(CustomerBill);