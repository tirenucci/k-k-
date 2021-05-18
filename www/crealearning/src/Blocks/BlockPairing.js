import React, {Fragment} from 'react'

//i18n
import { Translation } from 'react-i18next'

//Structure
import QuestionSkeleton from './QuestionSkeleton'
import ContentHelp from './General/ContentHelp'
import OptionsHelp from './General/OptionsHelp'

//Utilitaires
import Button from '../Components/formWidget/Button'
import Image from '../Components/Image'
import Fields from '../Components/formWidget/Fields'
import FileManagerModal from "../Components/modal/FileManagerModal";
import EditElement from "../Components/modal/EditElement";

class BlockPairing extends QuestionSkeleton{
    constructor(props){
        super(props);
        this.state = {
            disableRet: true,
            fileManager: false,
            question_score: 0,
            lang: props.lang,
            disableButton: true,
            position: props.nbBlock,
            type: '_QUIZ_MATCH',
            disableAssoc: false,
            options: {
                type: '_TXT',
                similar: false,
                nExemplar: 2,
                nCategory: 2,
                nMatch: 2,
                description: '_QUIZ_DESC',
                exemplars: [
                    'Créa Learning',
                    'Agora Learning'
                ],
                matches: [
                    {'exemplar': '1', 'category': 'A'},
                    {'exemplar': '2', 'category': 'B'}
                ],
                categoryTitle: 'Sélectionnez un élément',
                categorys: [
                    'Création de parcours pédagogique',
                    'Système de gestion de l\'apprentissage'
                ],
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
        this.setState({
            elemType: [
                {value:'_TXT', textTranslate:'_ELEM_TXT'},
                {value:'_IMG', textTranslate:'_ELEM_IMG'}
            ]
        })
    }
    validImage(url) {
        let {options} = this.state
        if (this.state.typeEdit === "exemplar"){
            if (this.state.key !== undefined) {
                options.exemplars[this.state.key] = url.replace('//', '/')
            } else {
                options.exemplars.push(url.replace('//', '/'))
                options.nExemplar = options.exemplars.length;
            }
        }

        this.setState({options, fileManager: false, disableButton: false})
    }

    moveUpExemplar(){
        const select = document.getElementById('exemplar');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && i > 0 && !select.options[0].selected) {
                let tmpOption = options.matches[i].category
                options.matches[i].category = options.matches[i - 1].category
                options.matches[i - 1].category = tmpOption
                let tmpAnwser = options.exemplars[i]
                options.exemplars[i] = options.exemplars[i-1]
                options.exemplars[i-1] = tmpAnwser
                select.options[i-1].selected = 'selected'
                select.options[i].selected = ''
            }
        }
        this.setState({options, disableButton: false})
    }

    moveDownExemplar(){
        const select = document.getElementById('exemplar');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && !select.options[select.length - 1].selected) {
                let tmpOption = options.matches[i].category
                options.matches[i].category = options.matches[i + 1].category
                options.matches[i + 1].category = tmpOption
                let tmpAnwser = options.exemplars[i]
                options.exemplars[i] = options.exemplars[i+1]
                options.exemplars[i+1] = tmpAnwser
                select.options[i].selected = ''
                select.options[i+1].selected = 'selected'
            }
        }

        this.setState({options, disableButton: false})
    }

    removeExemplar(){
        const select = document.getElementById('exemplar');
        let options = this.state.options
        let index
        let impossible = false
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected) {
                index = i
            }
        }


        options.matches.reverse().map((m, key) => {

            if (m.exemplar > index + 1) {
                m.exemplar--
            }
            else if (m.exemplar == index + 1) {
                options.exemplars.splice(index,1)
                options.nExemplar = options.exemplars.length;
                options.matches.splice(key,1)
                options.nMatch = options.matches.length;
            } else {
                impossible = true
            }
        })

        if (impossible) {
            options.exemplars.splice(index,1)
            options.nExemplar = options.exemplars.length;
        }

        options.matches.reverse()

        this.setState({options, disableButton: false})
    }

    editExemplar(){
        const select = document.getElementById('exemplar')

        let key,value

        let multi = false

        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && !multi) {
                multi = true
                key = i
                value = select.options[i].text
            }
        }
        if (this.state.options.type !== '_TXT'){
            this.setState({fileManager: true,key, value, typeEdit: 'exemplar'})
        } else {
            this.setState({modalEdit: true, key, value, typeEdit: 'exemplar'})
        }
    }

    addExemplar(){
        if (this.state.options.type !== '_TXT'){
            this.setState({fileManager : true,key: undefined, typeEdit:'exemplar'})
        } else {
            this.setState({modalEdit: true, key: undefined, typeEdit:'exemplar'})
        }
    }

    /**
     * LES GESTIONS DES CATEGORY
     * 
     */

    moveUpCategory(){
        const select = document.getElementById('category');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && i > 0 && !select.options[0].selected) {
                let tmpOption = options.matches[i].category
                options.matches[i].category = options.matches[i - 1].category
                options.matches[i - 1].category = tmpOption
                let tmpAnwser = options.categorys[i]
                options.categorys[i] = options.categorys[i-1]
                options.categorys[i-1] = tmpAnwser
                select.options[i-1].selected = 'selected'
                select.options[i].selected = ''
            }
        }
    
        this.setState({options, disableButton: false})
    }
    
    moveDownCategory(){
        const select = document.getElementById('category');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && !select.options[select.length - 1].selected) {
                let tmpOption = options.matches[i].category
                options.matches[i].category = options.matches[i + 1].category
                options.matches[i + 1].category = tmpOption
                let tmpAnwser = options.categorys[i]
                options.categorys[i] = options.categorys[i+1]
                options.categorys[i+1] = tmpAnwser
                select.options[i].selected = ''
                select.options[i+1].selected = 'selected'
            }
        }
    
        this.setState({options, disableButton: false})
    }

    removeCategory(){
        const select = document.getElementById('category');
        let options = this.state.options
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected) {
                options.matches.find(function(matche, index){
                    if (matche.category === String.fromCharCode(i + 65)){
                        options.matches.splice(index,1)
                    }
                })
                options.categorys.splice(i,1)
                options.nCategory = options.categorys.length;
            }
        }

        this.setState({options, disableButton: false})
    }

    removeCategory(){
        const select = document.getElementById('category');
        let options = this.state.options
        let index
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected) {
                index = i
                options.categorys.splice(i,1)
                options.nCategory = options.categorys.length;
            }
        }

        options.matches.map((m, key) => {
            if (m.category == String.fromCharCode(index + 65)){
               options.matches.splice(key,1)
            }
        })

        this.setState({options, disableButton: false})
    }


    removeCategory(){
        const select = document.getElementById('category');
        let options = this.state.options
        let index
        let impossible = false
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected) {
                index = i
            }
        }


        options.matches.reverse().map((m, key) => {

            if (m.categorys > String.fromCharCode(index + 65)) {
                m.category = m.categorys.charCode() - 1
            }
            else if (m.categorys == String.fromCharCode(index + 65)) {
                options.category.splice(index,1)
                options.nCategory = options.categorys.length;
                options.matches.splice(key,1)
                options.nMatch = options.matches.length;
            } else {
                impossible = true
            }
        })

        if (impossible) {
            options.categorys.splice(index,1)
            options.nCategory = options.categorys.length;
        }

        options.matches.reverse()


        this.setState({options, disableButton: false})
    }
    
    editCategory(){
        const select = document.getElementById('category')
    
        let key,value
    
        let multi = false
    
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected && !multi) {
                multi = true
                key = i
                value = select.options[i].text
            }
        }
        this.setState({modalEdit: true, key, value, typeEdit: 'category'})
    }
    
    addCategory(){
        this.setState({modalEdit: true, key: undefined, typeEdit:'category'})
    }

    ok(){
        let options = this.state.options
        if (this.state.typeEdit === "exemplar"){
            if (this.state.key !== undefined) {
                options.exemplars[this.state.key] = this.state.value
            } else {
                options.exemplars.push(this.state.value)
                options.nExemplar = options.exemplars.length;
            }
        }
        else if (this.state.typeEdit === "category") {
            if (this.state.key !== undefined) {
                options.categorys[this.state.key] = this.state.value
            } else {
                options.categorys.push(this.state.value)
                options.nCategory = options.categorys.length;
            }
        }
        

        this.setState({options, modalEdit: false, disableButton: false, value: ''})
    }

    assoc(){
        const select = document.getElementById('exemplar')
        const category = document.getElementById('category')
        let options = this.state.options
        
        for (let i = 0; i < select.length; i++) {
            for (let j = 0; j < category.length; j++){
                if (select.options[i].selected && category.options[j].selected) {
                    let exemplar = parseInt(select.options[i].value)
                    options.matches[options.matches.length] = {
                        'exemplar': exemplar += 1,
                        'category': category.options[j].value
                    }
                    options.nMatch = options.matches.length
                }
            }
        }
        this.setState({disableButton: false})
    }

    ret(){
        const select = document.getElementById('assoc')
        let options = this.state.options
        
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].selected) {
                options.matches.splice(i,1)
                options.nMatch = options.matches.length
            }
        }
        this.setState({disableRet: true, disableButton: false, options})
    }

    Content = () => {
        return(
            <Fragment>
                { this.state.fileManager ? <FileManagerModal onlyType={'image'} validImage={(url) => this.validImage(url)}  training={this.props.trainingUuid} title={"Bibliothèque"} changeUrl={(url) => this.handleUrlChange(url)} onAnnul={() => this.setState({fileManager: false})} /> : <Fragment /> }

                {
                    this.state.modalEdit ? <EditElement onOk={ () => this.ok() } change={(event) => this.setState({value: event.target.value})} value={this.state.value} onAnnul={() => this.setState({modalEdit: false})} /> : <Fragment />
                }
                <Translation>
                {
                    (t) => 
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
                            htmlFor='list1' 
                            className='grey__label' 
                            text='_LIST_1'
                        >
                            <select name='list1' size='5' multiple='multiple' id='exemplar'>
                                {
                                    this.state.options.exemplars.map((exemplar, key) => (
                                        <option value={key}>{exemplar}</option>
                                    ))
                                }
                            </select>
                            <ul className='btn-quizz-area'>
                                <li>
                                    <Button
                                        className='btn-up'
                                        type='button'
                                        buttonTitle='_MOVE_UP'
                                        onClick={() => this.moveUpExemplar()}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='btn-down'
                                        type='button'
                                        buttonTitle='_MOVE_DOWN'
                                        onClick={() => this.moveDownExemplar()}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='btn-edit'
                                        type='button'
                                        buttonTitle='_EDIT_ELEM'
                                        onClick={() => this.editExemplar()}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='btn-add'
                                        type='button'
                                        buttonTitle='_ADD_ELEM'
                                        onClick={(e) => this.addExemplar(e)}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='btn-remove'
                                        type='button'
                                        buttonTitle='_DELETE_ELEM'
                                        onClick={() => this.removeExemplar()}
                                    />
                                </li>
                            </ul>
                        </Fields>
                        <h6 className='grey__label'>{t('_LIST_2')}</h6>
                        <Fields
                            liClass='content-element'
                            htmlFor='listName'
                            text='_LIST_NAME'
                            inputType='text'
                            value={this.state.options.categoryTitle}
                            onChange={(event) => this.handleChange(event, 'categoryTitle')}
                        >
                            <select name='list2' size='5' multiple='multiple' id='category'>
                                {
                                    this.state.options.categorys.map((category, key) => (
                                        <option value={String.fromCharCode(key + 65)} title={t('_ANSWER_2')}>{category}</option>
                                    ))
                                }
                            </select>
                            <ul className='btn-quizz-area'>
                                <li>
                                    <Button
                                        className='btn-up'
                                        type='button'
                                        buttonTitle='_MOVE_UP'
                                        onClick={() => this.moveUpCategory()}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='btn-down'
                                        type='button'
                                        buttonTitle='_MOVE_DOWN'
                                        onClick={() => this.moveDownCategory()}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='btn-edit'
                                        type='button'
                                        buttonTitle='_EDIT_ELEM'
                                        onClick={() => this.editCategory()}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='btn-add'
                                        type='button'
                                        buttonTitle='_ADD_ELEM'
                                        onClick={() => this.addCategory()}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='btn-remove'
                                        type='button'
                                        buttonTitle='_DELETE_ELEM'
                                        onClick={() => this.removeCategory()}
                                    />
                                </li>
                            </ul>
                        </Fields>  
                        <Fields
                            liClass='content-element'
                            htmlFor='associations' 
                            className='grey__label' 
                            text='_MATCHES'
                        >
                            <select name='associations' id='assoc' size='5' multiple='multiple'>
                                {
                                    this.state.options.matches.map((match, key) => (
                                        match['category'] !== undefined ?
                                            <option onClick={() => this.setState({disableRet: false})} value={match['exemplar'] + '.' + match['category']}>{this.state.options.exemplars[match['exemplar'] - 1]} - {this.state.options.categorys[match['category'].charCodeAt(0) - 65]}</option>
                                        :
                                            <Fragment/>
                                    ))
                                }
                            </select>
                            <ul className='pairing-btn-wrapper'>
                                <li>
                                    <Button
                                        className='pairing-btn'
                                        buttonType='button'
                                        disable={this.state.disableAssoc}
                                        buttonTitle='_MATCH_ADD'
                                        buttonText='_MATCH'
                                        onClick={() => this.assoc()}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='pairing-btn'
                                        buttonType='button'
                                        disable={this.state.disableRet}
                                        buttonTitle='_MATCH_DELETE'
                                        buttonText='_REMOVE'
                                        onClick={() => this.ret()}
                                    />
                                </li>
                            </ul>
                        </Fields>        
                    </ul>
 
                }
            </Translation>
            </Fragment>
       )
    }

    Options = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <Fields
                            liClass='option-element'
                            htmlFor='elementType'
                            text='_ELEM_TYPE'
                            options={this.state.elemType}
                            onChange={(e) => this.handleChange(e, 'type')}
                        />
                        <Fields
                            liClass='checkbox'
                            inputType='checkbox'
                            htmlFor='exclusiveChoice'
                            text='_EXCLUSIVE_CHOICE'
                        />
                        {
                            //A compléter
                        }
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
                        <h3>{t('_QUIZ_MATCH')}</h3>
                        <div className='highlight'>
                            <p><b>{t('_QUIZ_EXERCICE')}</b>{t('_MATCH_HELP_1')}</p>
                        </div>
                        <ContentHelp>
                            <ul>
                                <li><b>{t('_LIST_1')}</b>{t('_MATCH_HELP_2')}</li>
                                <li><b>{t('_LIST_2')}</b>{t('_MATCH_HELP_3')}<b>{t('_LIST_NAME_2')}</b>{t('_MATCH_HELP_4')}</li>
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
                                <li><b>{t('_LIST_1_TYPE')}</b>{t('_LIST_1_HELP')}</li>
                                <li><b>{t('_EXCLUSIVE_CHOICE')}</b>{t('_EXCLUSIVE_CHOICE')}</li>
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

export default BlockPairing