import React, {Fragment} from 'react'

import QuestionSkeleton from './QuestionSkeleton'
import ContentHelp from './General/ContentHelp'

import EditElement from '../Components/modal/EditElement'
import Button from '../Components/formWidget/Button'
import Image from '../Components/Image'
import Fields from '../Components/formWidget/Fields'

//i18n
import { Translation } from 'react-i18next'

class BlockLikert extends QuestionSkeleton{

    constructor(props){
        super(props)

        this.state = {
            question_score: 0,
            lang: props.lang,
            position: props.nbBlock,
            disableButton: true,
            type: '_QUIZ_LIKERT',
            options: {
                similar: false,
                description: '_QUIZ_DESC',
                nItems: 5,
                items: [
                    'Item 1',
                    'Item 2',
                    'Item 3',
                    'Item 4',
                    'Item 5',
                ]
            }
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


    moveUp(){
        const select = document.getElementById('liker');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && i > 0 && !select.options[0].selected) {
                let tmpAnwser = options.items[i]
                options.items[i] = options.items[i-1]
                options.items[i-1] = tmpAnwser
                select.options[i-1].selected = 'selected'
                select.options[i].selected = ''
            }
        }

        this.setState({options, disableButton: false})
    }

    moveDown(){
        const select = document.getElementById('liker');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && !select.options[select.length - 1].selected) {
                let tmpAnwser = options.items[i]
                options.items[i] = options.items[i+1]
                options.items[i+1] = tmpAnwser
                setTimeout(() => {
                    select.options[i].selected = ''
                    select.options[i+1].selected = 'selected'
                }, 100)
            }
        }

        this.setState({options, disableButton: false})
    }

    remove(){
        const select = document.getElementById('liker');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected) {
                options.items.splice(i,1)
                options.nItems = options.items.length
            }
        }

        this.setState({options, disableButton: false})
    }

    edit(){
        const select = document.getElementById('liker')

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
        this.setState({modalEdit: true})
    }

    ok(){
        let options = this.state.options

        if (this.state.key !== undefined) {
            options.items[this.state.key] = this.state.value
        } else {
            options.items.push(this.state.value)
            options.nItems = options.items.length
        }

        this.setState({options, modalEdit: false, disableButton: false})
    }

    Content = () => {
        return(
            <ul className='content-list'>
                {
                    this.state.modalEdit ? <EditElement onOk={ () => this.ok() } change={(event) => this.setState({value: event.target.value})} value={this.state.value} onAnnul={() => this.setState({modalEdit: false})} /> : <Fragment />
                }
                <Fields 
                    htmlFor='description' 
                    text='_QUIZ_NAME'
                    liClass='content-element'
                    textarea={true}
                    value={this.state.options.description} 
                    onChange={(event) => this.handleChange(event, 'description')}
                />
                <Fields
                    htmlFor='liker' 
                    className='grey__label' 
                    text='_ELEMENTS'
                    liClass='content-element'
                >
                    <select name='liker' id='liker' size='5' multiple='multiple'>
                        {
                            this.state.options.items.map((item, key) => (
                                <option value={item} key={key}>{item}</option>
                            ))
                        }
                    </select>
                    <ul className='btn-quizz-area'>
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

    Tabs = () => {
        this.setState({tabs: [
            {'text': '_CONTENT', 'class': 'tab__link actif', 'link': '#contenu'},
            {'text': '_HELP', 'class': 'tab__link', 'link': '#aide'},
        ], currentTab:'CONTENU'})
    }

    Help = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{t('_LIKERT')}</h3>
                        <div className='highlight'>
                            <p><b>{t('_QUIZ_EXERCICE')}</b>{t('_LIKER_HELP_1')}</p>
                        </div>
                        <ContentHelp>
                            <p>{t('_LIKER_HELP_2')}</p>
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

export default BlockLikert