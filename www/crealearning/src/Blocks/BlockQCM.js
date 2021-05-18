import React, {Fragment} from 'react'

//i18n
import { Translation } from 'react-i18next'

//Structure
import QuestionSkeleton from './QuestionSkeleton'
import ContentHelp from './General/ContentHelp'
import OptionsHelp from './General/OptionsHelp'

//Utilitaires
import EditElement from '../Components/modal/EditElement'
import Button from '../Components/formWidget/Button'
import Image from '../Components/Image'
import Fields from '../Components/formWidget/Fields'

class BlockQCM extends QuestionSkeleton{
    constructor(props){
        super(props);
        this.state = {
            question_score: 0,
            position: props.nbBlock,
            disableButton: true,
            type: '_QUIZ_MCQ',
            lang: props.lang,
            options: {
                similar: false,
                precision: 0,
                tolerance: 0,
                type: '_MCQ',
                description: '_QUIZ_DESC',
                nAnswers: 2,
                answers: [
                    {'value': '_MCQ_ANSWER_1', 'correct': '1'},
                    {'value': '_MCQ_ANSWER_2', 'correct': '0'}
                ],
            },
            optionsType: [
                {value:'_MCQ', textTranslate:'_MCQ'},
                {value:'_UCQ', textTranslate:'_UCQ'}
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

    changeType(){
        const select = document.getElementById('responses');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (this.state.options.type === '_UCQ'){
                if (!select.options[i].selected && options.answers[i].correct === '1') {
                    options.answers[i].correct = '0'
                }
                if (select.options[i].selected && options.answers[i].correct === '1') {
                    options.answers[i].correct = '0'
                } else if(select.options[i].selected && options.answers[i].correct === '0') {
                    options.answers[i].correct = '1'
                }
            }
            else
            {
                if (select.options[i].selected && options.answers[i].correct === '1') {
                    options.answers[i].correct = '0'
                } else if(select.options[i].selected && options.answers[i].correct === '0') {
                    options.answers[i].correct = '1'
                }
            }
            
        }

        this.setState({options, disableButton: false})
    }

    moveUp(){
        const select = document.getElementById('responses');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && i > 0 && !select.options[0].selected) {
                let tmpAnwser = options.answers[i]
                options.answers[i] = options.answers[i-1]
                options.answers[i-1] = tmpAnwser
                select.options[i-1].selected = 'selected'
                select.options[i].selected = ''
            }
        }

        this.setState({options, disableButton: false})
    }

    moveDown(){
        const select = document.getElementById('responses');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && i < select.length && !select.options[select.length - 1].selected) {
                let tmpAnwser = options.answers[i]
                options.answers[i] = options.answers[i+1]
                options.answers[i+1] = tmpAnwser
                setTimeout(() => {
                    select.options[i].selected = ''
                    select.options[i+1].selected = 'selected'
                }, 100)
            }
        }

        this.setState({options, disableButton: false})
    }

    remove(){
        const select = document.getElementById('responses');
        let {options} = this.state
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected) {

                options.answers.splice(i, 1)
                options.nAnswers = options.answers.length;
            }
        }

        this.setState({options, disableButton: false})
    }

    edit(){
        const select = document.getElementById('responses')

        let key,value

        let multi = false

        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && !multi) {
                multi = true
                key = i
                value = select.options[i].value
            }
        }

        this.setState({modalEdit: true, key, value})
    }

    add(){
        let value
        this.setState({modalEdit: true, key: undefined, value})
    }

    ok(){
        let options = this.state.options

        if (this.state.key !== undefined) {
            options.answers[this.state.key].value = this.state.value
        } else {
            let obj = {};
            obj['value'] = this.state.value
            obj['correct'] = '0'

            options.answers.push(obj)
            options.nAnswers = options.answers.length
        }

        this.setState({options, modalEdit: false, disableButton: false})
    }

    Content = () => {
        return(
            <ul className='content-list'>
                {
                    this.state.modalEdit ? <EditElement onOk={ () => this.ok() }change={(event) => this.setState({value: event.target.value})} value={this.state.value} onAnnul={() => this.setState({modalEdit: false})} /> : <Fragment />
                }
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
                    htmlFor='responses' 
                    text='_MCQ_ANSWERS'
                >
                    {
                        this.state.options.answers !== undefined ?
                            <select name='responses' id='responses' size='5' multiple='multiple'>
                            {
                                this.state.options.answers.map((answer, key) => ( 
                                    <Translation>
                                        {
                                            (t) => 
                                            <option onDoubleClick={() => this.edit()} title={t(answer.value)} value={t(answer.value)} className={answer.correct === '1' ? 'correct' : 'incorrect'}>{t(answer.value)}</option> 
                                        }
                                    </Translation>
                                ))
                            }
                            </select>
                        :
                            <Fragment/>
                    }
                    <ul className='btn-quizz-area'>
                        <li>
                            <Button
                                className='btn-check'
                                type='button'
                                buttonTitle='_MCQ_SWITCH_ANSWERS'
                                onClick={() => this.changeType()}
                            />
                        </li>
                        <li>
                            <Button
                                className='btn-up'
                                type='button'
                                buttonTitle='_MOVE_UP'
                                onClick={() => this.moveUp()}
                            />
                        </li>
                        <li>
                            <Button
                                className='btn-down'
                                type='button'
                                buttonTitle='_MOVE_DOWN'
                                onClick={() => this.moveDown()}
                            />
                        </li>
                        <li>
                            <Button
                                className='btn-edit'
                                type='button'
                                buttonTitle='_EDIT_ELEM'
                                onClick={() => this.edit()}
                            />
                        </li>
                        <li>
                            <Button
                                className='btn-add'
                                type='button'
                                buttonTitle='_ADD_ELEM'
                                onClick={() => this.add()}
                            />
                        </li>
                        <li>
                            <Button
                                className='btn-remove'
                                type='button'
                                buttonTitle='_DELETE_ELEM'
                                onClick={() => this.remove()}
                            />
                        </li>
                    </ul>
                </Fields>
            </ul>
        )
    }

    Options = () => {
        return(
            <Fields
                liClass='option-element'
                htmlFor='questionType' 
                text='_MCQ_TYPE'
                value={this.state.options.type} 
                onChange={(event) => this.handleChange(event, 'type')}
                options={this.state.optionsType}
            />
        )
    }


    Help = () => {
        return(
            <Translation>
                {
                    (t) =>
                    <Fragment>
                        <h3>{t('_MCQ_QCU')}</h3>
                        <div className='highlight'>
                            <p><b>{t('_QUIZ_EXERCICE')}</b>{t('_MCQ_HELP_1')}</p>
                        </div>
                        <ContentHelp>
                            <p>{t('_MCQ_HELP_2')}</p>
                            <ul>
                                <li>
                                    <Image src='/assets/img/help/img_move_up_down.jpg' alt='_ARROW_ICON' className='img-inline'/>
                                    {t('_QUIZ_MOVE')}
                                </li>
                                <li>
                                    <img src='/assets/img/help/img_item_add_remove.jpg' alt='_PLUS_ICON' className='img-inline'/>
                                    {t('_QUIZ_ADD')}
                                </li>
                                <li><img src='/assets/img/help/img_item_edit.jpg' alt='_PENCIL_ICON' className='img-inline'/>
                                    {t('_QUIZ_EDIT')}
                                </li>
                            </ul>
                        </ContentHelp>
                        <OptionsHelp>
                            <ul>
                                <li><b>{t('_QUIZ_POINTS')}</b>{t('_QUIZ_POINTS_EXPLAIN')}</li>
                                <li><b>{t('_MCQ_TYPE')}</b>{t('_MCQ_TYPE_HELP')}</li>
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

export default BlockQCM