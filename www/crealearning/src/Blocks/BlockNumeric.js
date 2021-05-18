import React, {Fragment} from 'react'

//i18n
import { Translation } from 'react-i18next'

//Structure
import QuestionSkeleton from './QuestionSkeleton'
import ContentHelp from './General/ContentHelp'
import OptionsHelp from './General/OptionsHelp'

//Utilitaire
import Fields from '../Components/formWidget/Fields'

class BlockNumeric extends QuestionSkeleton{
    constructor(props){
        super(props);
        this.state = {
            question_score: 0,
            lang: props.lang,
            position: props.nbBlock,
            disableButton: true,
            type: '_QUIZ_NUMERIC',
            options: {
                similar: false,
                answer: 0,
                tolerance: 0,
                precision: 0,
                description: '_QUIZ_DESC'
            },
            precisionOption: [
                {value:'1', text:'1'},
                {value:'2', text:'2'},
                {value:'3', text:'3'},
                {value:'4', text:'4'},
                {value:'5', text:'5'}
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
                    inputType='number' 
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
                    <article>
                        <h6 className='grey__label'>{t('_DISPLAY')}</h6>
                        <ul>
                            <Fields 
                                liClass='option-element' 
                                htmlFor='precision' 
                                text='_PRECISION' 
                                value={this.state.options.precision}
                                onChange={(event, target) => this.handleChange(event, 'precision')}
                                options={this.state.precisionOption}
                            />
                            <Fields 
                                liClass='option-element' 
                                htmlFor='tolerance' 
                                text='_TOLERANCE' 
                                inputType='text' 
                                value={this.state.options.tolerance}
                                onChange={(event, target) => this.handleChange(event, 'tolerance')}
                            />
                        </ul>
                    </article>
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
                        <h3>{t('_QUIZ_NUMERIC')}</h3>
                        <div className='highlight'>
                            <p><b>{t('_QUIZ_EXERCICE')}</b></p>
                        </div>
                        <ContentHelp>
                            <ul>
                                <li><b>{t('_QUIZ_ANSWER')}</b>{t('_NUMERIC_HELP_2')}</li>
                            </ul>
                        </ContentHelp>
                        <OptionsHelp>
                            <ul>
                                <li><b>{t('_QUIZ_POINTS')}</b>{t('_QUIZ_POINTS_EXPLAIN')}</li>
                                <li><b>{t('_PRECISION')}</b>{t('_PRECISION_HELP')}</li>
                                <li><b>{t('_TOLERANCE')}</b>{t('_TOLERANCE_HELP')}</li>
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

export default BlockNumeric