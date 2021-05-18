import React, {Fragment} from 'react'

import QuestionSkeleton from './QuestionSkeleton'
import ContentHelp from './General/ContentHelp'
import OptionsHelp from './General/OptionsHelp'

//Utilitaire
import Fields from '../Components/formWidget/Fields'

//i18n
import { Translation } from 'react-i18next'

class BlockTrueFalse extends QuestionSkeleton{
    constructor(props){
        super(props);
        this.state = {
            question_score: 0,
            lang: props.lang,
            disableButton: true,
            position: props.nbBlock,
            type: '_QUIZ_TRUE_FALSE',
            options: {
                similar: false,
                answer: 'true',
                showIconsTF: false,
                hideTextTF: false,
                description: '_QUIZ_DESC'
            },
            answerOption: [
                {value:'true', textTranslate: '_TRUE'},
                {value:'false', textTranslate: '_FALSE'}
            ]
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
                    liClass='content-element'
                    htmlFor='description' 
                    text='_QUIZ_NAME'
                    textarea={true} 
                    value={this.state.options.description} 
                    onChange={(event, target) => this.handleChange(event, 'description')}
                />
                <Fields
                    liClass='content-element'
                    htmlFor='answer' 
                    text='_QUIZ_ANSWER'
                    options={this.state.answerOption} 
                    value={this.state.options.answer} 
                    onChange={(event, target) => this.handleChange(event, 'answer')}
                />
            </ul>
        )
    }

    Options = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <li>
                            <h6 className='grey__label'>{t('_DISPLAY')}</h6>
                        </li>
                        <Fields
                            liClass='checkbox'
                            htmlFor='display' 
                            text='_DISPLAY_ICON'
                            inputType='checkbox' 
                            checked={this.state.options.showIconsTF} 
                            onChange={(event, target, check) => this.handleChange(event, 'showIconsTF', true)}
                        />
                        <Fields
                            liClass='checkbox'
                            htmlFor='hideText' 
                            text='_HIDE_TEXT'
                            inputType='checkbox' 
                            checked={this.state.options.hideTextTF}
                            disabled={!this.state.options.showIconsTF}
                            onChange={(event, target, check) => this.handleChange(event, 'hideTextTF', true)}
                        />
                    </Fragment>
                }
            </Translation>
        )
    }

    Help = () => {
        return(            
            <Translation>
                {
                    (t) =>
                    <Fragment>
                        <h3>{t('_QUIZ_TRUE_FALSE')}</h3>
                        <div className='highlight'>
                            <p><b>{t('_QUIZ_EXERCICE')}</b>{t('_TF_HELP_1')}</p>
                        </div>
                        <ContentHelp>
                            <ul>
                                <li><b>{t('_QUIZ_ANSWER')}</b>{t('_TF_HELP_2')}</li>
                            </ul>
                        </ContentHelp>
                        <OptionsHelp>
                            <ul>
                                <li><b>{t('_QUIZ_POINTS')}</b>{t('_QUIZ_POINTS_EXPLAIN')}</li>
                                <li><b>{t('_QUIZ_FEEDBACK')}</b>{t('_QUIZ_FEEDBACK_HELP')}</li>
                            </ul>
                            <p>{t('_NB')}</p>
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

export default BlockTrueFalse