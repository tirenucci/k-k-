import React, { Component, Fragment } from 'react'

//i18n
import { Translation } from 'react-i18next'

//Utilitaires
import NavBarSecondary from '../../Components/NavBarSecondary'
import HelpBlock from './HelpBlock'
import DeleteModal from '../../Components/modal/DeleteModal'
import Button from '../../Components/formWidget/Button'

//Style
import './Notes.scss'
import Fields from '../../Components/formWidget/Fields'
import cookie from "react-cookies";
import {getUserInformation} from "../../Utils/GetUserInformation";
import {fetchApi} from "../../Utils/Fetch";

class Notes extends Component {
    state={
        tabs: [
            {'text': '_NOTES', 'variable': '(***)', 'class': 'tab__link actif', 'link': '#notes', 'id':'notes', 'type':'notes'},
            {'text': '_HELP', 'class': 'tab__link', 'link': '#aide', 'id':'aide', 'type':'aide'},
        ],
        deleted: false,
        notes: [],
        currentTab : 'notes',
        showNotes : false,
        user: []
    }

    evenement = (tabs) => {
        this.setState({currentTab: tabs})
    }

    componentDidMount = async function(){

        await this.getNote()
    }

    //Permet de créer une note
    async createNote(){
        let response = await fetchApi('note/new', 'POST', true, {
            id_user: this.state.user.id,
            id_grain: this.props.grain_id
        })

        if (response){
            await this.props.getAllGrain(true)
            await this.getNote()
            this.setState({showNotes:true})
        }
    }

    async getNote(grain_id = this.props.grain_id){

        await getUserInformation().then(user => this.setState({user}))

        let notes = await fetchApi(`note/get_all?grain_id=${grain_id}`, 'GET')

        if (notes) {
            this.setState({notes})
        }
    }

    // Permet de supprimer une note
    async delete(){
        let response = await fetchApi('note/remove', 'DELETE', true, {
            id_note: this.state.deleted_note
        })

        if (response){
            await this.props.getAllGrain(true)
            await this.getNote()
            this.setState({showNotes:true, deleted: false})
        }
    }

    //Permet de modifier une note
    async update(id, key){
        let response = await fetchApi('note/update', 'PUT', true, {
            id_note: id,
            content: this.state.notes[key].content
        })

        if (response){
            await this.props.getAllGrain(true)
            await this.getNote()
            this.setState({showNotes:true})
        }
    }

    handleChange(event, key){
        let notes = this.state.notes
        notes[key].content = event.target.value
        if (notes[key].disabled === true){
            notes[key].disabled = false
        }
        this.setState({notes})
    }

    render() {
        return (
            <Fragment>
            {
                this.state.user !== undefined ?
                    <Fragment>
                    <aside className='notes-navbar'>
                        {
                            this.state.deleted ? <DeleteModal onOk={() => this.delete()} onAnnul={() => this.setState({deleted: false})} /> : <Fragment />
                        }
                        <NavBarSecondary
                            tabs={this.state.tabs} 
                            className='tab__menu blocks__tab'
                            evenement={(tabs) => this.evenement(tabs)}
                            variable={this.state.notes.length !== undefined ? this.state.notes.length : '0'}
                        />
                        <Button 
                            className='close__btn'
                            buttonTitle='_CLOSE'
                            type='button'
                            onClick={this.props.close}
                        />
                        {
                            this.state.currentTab === 'aide' ?
                            <HelpBlock/> 
                            : 
                            <section className='note__section'>
                                <Button
                                    className='formula__btn'
                                    buttonType='button'
                                    onClick={(event) => this.createNote()}
                                    buttonText='_GRAIN_ADD_NOTE'
                                />
                                {
                                    this.state.notes instanceof Array ?
                                        this.state.notes.map((n, key) => (
                                            <Fragment>
                                                <ul className='note-list' key={key}>
                                                    <Translation>
                                                    {(t)=><li>
                                                        {
                                                            n.id_user === this.state.user.id && n.content !== '' || n.updated_at !== n.created_at ?
                                                            <span>{t('_GRAIN_EDIT_BY', {date:n.created_at})}<br/>{t('_GRAIN_EDIT_ON', {date:n.updated_at})}</span>
                                                            : n.id_user !== this.state.user.id && n.content !== '' || n.updated_at !== n.created_at ?
                                                            <span>Par <b>{n.name}</b>, le {n.created_at}<br/>{t('_GRAIN_EDIT_ON', {date:n.updated_at})}</span>
                                                            :n.id_user !== this.state.user.id ?
                                                            <span>Par <b>{n.name}</b>, le {n.created_at}</span>
                                                            :n.id_user === this.state.user.id ?
                                                            <span>Par <b>Vous</b>, le {n.created_at}</span>
                                                            :<Fragment />
                                                        }
                                                        <Fields 
                                                            htmlFor='noteDescription'
                                                            textarea={true}
                                                            textareaClass='noteDescription'
                                                            onChange={(event, k) => this.handleChange(event, key)} 
                                                            value={n.content}
                                                        />
                                                    </li>
                                                    }
                                                    </Translation>
                                                </ul>
                                                <ul className='btn__list'>
                                                    <li>
                                                        <Button
                                                            className='orange__btn'
                                                            type='submit'
                                                            disable={n.disabled}
                                                            buttonText='_SAVE'
                                                            onClick={(id_note, k) => this.update(n.id, key)}
                                                        />
                                                    </li>
                                                    <li>
                                                        <Button
                                                            className='grey__btn'
                                                            type='reset'
                                                            buttonText='_DELETE'
                                                            onClick={() => this.setState({deleted: true, deleted_note: n.id})}
                                                        />
                                                    </li>
                                                </ul>
                                            </Fragment>
                                        ))
                                    :
                                        <Fragment />
                                }
                            </section>
                        }
                    </aside>
                </Fragment>
            :
                <Fragment />
            }
            </Fragment>
        );
    }
}

export default Notes;