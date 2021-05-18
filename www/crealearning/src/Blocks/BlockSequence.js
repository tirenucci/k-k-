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
import FileManagerModal from "../Components/modal/FileManagerModal";

class BlockSequence extends QuestionSkeleton{
    constructor(props){
        super(props);
        this.state = {
            fileManager: false,
            question_score: 0,
            lang: props.lang,
            disableButton: true,
            position: props.nbBlock,
            type: '_QUIZ_SEQUENCE',
            options: {
                similar: false,
                type: '_TXT',
                description: '_QUIZ_DESC',
                nItems: 5,
                items: [
                    'Item 1',
                    'Item 2',
                    'Item 3',
                    'Item 4',
                    'Item 5',
                ]
            },
            optionsType: [
                {value:'_TXT', textTranslate:'_ELEM_TXT'},
                {value:'_IMG', textTranslate:'_ELEM_IMG'},
                {value:'_SND', textTranslate:'_ELEM_SND'},
                {value:'_VID', textTranslate:'_ELEM_VID'}
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
    validImage(url) {
        let {options} = this.state

        options.url = url.replace('//', '/')


        this.setState({options, fileManager: false, disableButton: false})
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
                options.items.splice(i, 1)
                options.nItems = options.items.length;
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
        if (this.state.options.type !== '_TXT'){
            this.setState({fileManager : true})
        } else {
            this.setState({modalEdit: true, key, value})
        }
    }

    add(){
        if (this.state.options.type !== '_TXT'){
            this.setState({fileManager : true})
        } else {
            this.setState({modalEdit: true, key: undefined})
        }
    }

    ok(){
        let options = this.state.options

        if (this.state.key !== undefined) {
            options.items[this.state.key] = this.state.value
        } else {
            options.items.push(this.state.value)
            options.nItems++
        }

        this.setState({options, modalEdit: false, disableButton: false})
    }


    Content = () => {

        return(
            <Fragment>
                { this.state.fileManager ? <FileManagerModal onlyType={'image'} validImage={(url) => this.validImage(url)}  training={this.props.trainingUuid} title={"Bibliothèque"} changeUrl={(url) => this.handleUrlChange(url)} onAnnul={() => this.setState({fileManager: false})} /> : <Fragment /> }

                <ul className='content-list'>
                {
                    this.state.modalEdit ? <EditElement onOk={ () => this.ok() } change={(event) => this.setState({value: event.target.value})} value={this.state.value} onAnnul={() => this.setState({modalEdit: false})} /> : <Fragment />
                }
                <Fields 
                    liClass='content-element' 
                    htmlFor='description' 
                    text='_QUIZ_NAME'
                    textare={true}
                    value={this.state.options.description} 
                    onChange={(event, target) => this.handleChange(event, 'description')}
                />
                <Fields
                    liClass='content-element' 
                    htmlFor='elements' 
                    text='_ELEMENTS'
                    className='grey__label'
                >
                    <select name='elements' id='liker' size='5' multiple='multiple'>
                        {
                            this.state.options.items.map((item, key) => (
                                <option value={item}>{item}</option>
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
            </Fragment>
        )
    }

    Options = () => {
        return(
            <Fields
                liClass='option-element'
                htmlFor='elementType' 
                text='_ELEM_TYPE'
                value={this.state.options.type} 
                onChange={(event, target) => this.handleChange(event, 'type')}
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
                    <h3>{t('_QUIZ_SEQUENCE')}</h3>
                    <div className='highlight'>
                        <p><b>{t('_QUIZ_EXERCICE')}</b>{t('_SEQUENCE_HELP_1')}</p>
                    </div>
                    <ContentHelp>
                        <p>{t('_SEQUENCE_HELP_2')}<br/>
                        {t('_SEQUENCE_HELP_3')}</p>
                        <ul>
                            <li>
                                <Image src='/assets/img/help/img_move_up_down.jpg' alt='_ARROW_ICON' className='img-inline'/>
                                {t('_QUIZ_MOVE')}
                            </li>
                            <li>
                                <Image src='/assets/img/help/img_item_add_remove.jpg' alt='_PLUS_ICON' className='img-inline'/>
                                {t('_QUIZ_ADD')}
                            </li>
                            <li><Image src='/assets/img/help/img_item_edit.jpg' alt='_PENCIL_ICON' className='img-inline'/>
                                {t('_QUIZ_EDIT')}
                            </li>
                            <li>
                                <Image src='/assets/img/help/img_open_file.jpg' alt='_FILE_ICON' className='img-inline'/>
                                {t('_QUIZ_ADD_FILE')}
                            </li>
                        </ul>
                    </ContentHelp>
                    <OptionsHelp>
                        <ul>
                            <li><b>{t('_QUIZ_POINTS')}</b>{t('_QUIZ_POINTS_EXPLAIN')}</li>
                            <li><b>{t('_ELEM_TYPE')}</b>{t('_SEQUENCE_HELP_4')}</li>
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

export default BlockSequence