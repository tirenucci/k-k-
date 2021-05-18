import React, {Fragment} from 'react';
import BlockSkeleton from './BlockSkeleton';
import { Translation } from 'react-i18next';

class BlockSeparator extends BlockSkeleton {

    
    constructor(props){
        super(props);
        this.state = {
            lang: props.lang,
            position: props.nbBlock,
            disableButton: true,
            type: '_HR',
            options: {
                similar: false
            },
        }
    }



    componentDidMount(){
        super.componentDidMount()
        if (this.props.id_block !== undefined)
        {
            this.getBlockContent()
        }
        else
        {
            this.sendBlockToBack()
        }
    }

    Tabs = () => {
        this.setState({tabs: [
            {'text': '_HELP', 'class': 'tab__link actif', 'link': '#aide'},
        ], currentTab:'AIDE'})
    }

    Help = () => {
        return (
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{t('_HR')}</h3>
                        <p>{t('_HR_HELP')}</p>
                    </Fragment>
                }
            </Translation>
        );
    }
};

export default BlockSeparator;