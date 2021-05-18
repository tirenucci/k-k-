import React, {Fragment} from 'react'
import BlockSkeleton from './BlockSkeleton'

import OptionsHelp from './General/OptionsHelp'
import ContentHelp from './General/ContentHelp'
import { Translation } from 'react-i18next';
import Fields from '../Components/formWidget/Fields';

class BlockTitle extends BlockSkeleton{
    constructor(props){
        super(props);
        this.state = {
            lang: props.lang,
            disableButton: true,
            position: props.nbBlock,
            type: '_TITLE',
            options: {
                text: "",
                level: 'h1',
                similar: false
            },
            levelOptions: [
                {value:'h1', textTranslate:'_LEVEL_1'},
                {value:'h2', textTranslate:'_LEVEL_2'},
                {value:'h3', textTranslate:'_LEVEL_3'},
                {value:'h4', textTranslate:'_LEVEL_4'},
                {value:'h5', textTranslate:'_LEVEL_5'},
                {value:'h6', textTranslate:'_LEVEL_6'}
            ],
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

    Content = () => {
        return(
            <ul className='content-list'>
                <Fields
                    htmlFor='titleDescription'
                    value={this.state.options.text} 
                    onChange={(event, target) => this.handleChange(event, 'text')}
                    inputType='text'
                    placeholder={'_TITLE_BLOC'}
                />
            </ul>
        )
    }

    Options = () => {
        return(
            <Fields
                liClass='option-element title__level'
                htmlFor='levelTitle'
                text='_TITLE_LEVEL'
                onChange={(event, target) => this.handleChange(event, 'level')} 
                value={this.state.options.level}
                options={this.state.levelOptions}
            />
        )
    }

    Help = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{t('_TITLE')}</h3>
                        <ContentHelp>
                            <p>{t('_TITLE_HELP')}</p>
                        </ContentHelp>
                        <OptionsHelp>
                            <p>{t('_TITLE_HELP_2')}</p>
                            <div className='highlight'>
                                <p>
                                    {t('_TITLE_HELP_3')}
                                </p>
                            </div>
                        </OptionsHelp>
                    </Fragment>
                }
            </Translation>
        )
    }

    render(){
        return(
            super.render()
        )
    }
}

export default BlockTitle