import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import CustomerContent from './CustomerContent'
import Image from '../Image'

const CustomerInvoice = ({t}) => {
    return (
        <CustomerContent
            customerTitle='_CUSTOMER_TITLE_5'>
            <p className='customer__help'>{t('_INVOICE_DESC')}</p>
            <table className='invoice__table'>
                <colgroup>
                    <col className='medium__view'/>
                    <col/>
                    <col className='small__view'/>
                    <col/>
                    <col/>
                    <col/>
                </colgroup>
                <thead>
                    <tr>
                        <th className='medium__view'>{t('_DESCRIPTION')}</th>
                        <th>{t('_BILL_NB')}</th>
                        <th className='small__view'>{t('_PAYMENT_DATE')}</th>
                        <th>{t('_STATE')}</th>
                        <th>{t('_SUM')}</th>
                        <th>{t('_FILE')}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        //Boucler pour chaque facture
                    }
                    <tr>
                        <td className='medium__view'>Open Crea Pro (Prix : /mois, Mention : (Soit 239.88€ HT pour un engagement sur 12 mois))</td>
                        <td>FOC0002</td>
                        <td className='small__view'>01/11/2017</td>
                        <td>à regler</td>
                        <td>47,98€</td>
                        <td>
                            <button title={t('_DL_INVOICE', {number:'test'})}>
                                <Image src='/assets/img/icons/pdf-icon.png' alt='_PDF_ICON'/>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </CustomerContent>
    );
};

export default withTranslation()(CustomerInvoice);