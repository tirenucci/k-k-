import React, { Component, Fragment } from 'react'
import { SortableItem, swapArrayPositions } from 'react-sort-list'

//Utilitaires
import Button from './../../Components/formWidget/Button'
import Option from '../../Components/html/Option'
import Fields from '../../Components/formWidget/Fields'

//AddGrain
import GrainHandler from './GrainHandler'

//Style
import './AddGrain.scss'
import {fetchApi} from "../../Utils/Fetch";

class AddGrain extends Component{

    async switchPosition(){
        let response = await fetchApi('grain/switch_position', 'POST', true, {
            id: this.props.id_training,
            grains: this.props.grains
        })
    }

    handleLangChange(event){
        this.props.setNewLang(event.target.value)
    }

    async getLanguage(){
        let response = await fetchApi(`training_language/get_all_by_training?id=${this.props.id_training}`, 'GET')

        if (response){
            const languages = await response
            this.setState({languages})
        }
    }

    swap(dragIndex, dropIndex) {
        let swappedTodo = swapArrayPositions(this.props.grains, dragIndex, dropIndex)
        this.setState({
            grains: swappedTodo
        })
        this.switchPosition()
    }

    constructor({props}){
        super(props)
        this.swap = this.swap.bind(this)
    }

    componentDidMount = async() =>{
        await this.getLanguage(this.props.id_training)
    }

    render(){
        return (
            <section className='grain__section'>
                <ul className={`grain__tools ${this.state !== null && this.state.languages !== undefined && this.state.languages.length > 1 ? 'with__lang' : ''}`}>
                    {
                        this.state !== null && this.state.languages !== undefined && this.state.languages.length > 1 ?
                            <Fields
                                liClass='grain__lang__selector'
                                htmlFor='language' 
                                text='_GRAIN_LANG'
                            >
                                <select id='language' name='language' onChange={(event) => this.handleLangChange(event)}>
                                    {

                                        this.state !== null && this.state.languages !== undefined ?
                                            this.state.languages.map((lang, key) => (
                                                <Option value={lang.iso_code_6391} textTranslate={lang.label_fr} text={'(' + lang.label + ')'} />
                                            ))
                                        :
                                            <Fragment/>
                                    }
                                </select>
                            </Fields>
                        :
                            <Fragment/>
                    }
                    {
                        this.props.right !== undefined && this.props.right.is_editor ?
                            <li>
                                <Button
                                    className='green__btn'
                                    buttonType='button'
                                    buttonTitle='_GRAIN_ADD'
                                    buttonText='_GRAIN_ADD'
                                    onClick={() => this.props.createGrain()}
                                />
                            </li>
                        :
                            <Fragment />
                    }
                </ul>
                <ul id='grain__list'>
                    {
                        this.props.grains !== undefined && this.props.grains instanceof Array ?

                            this.props.right !== undefined && this.props.right.is_editor ?
                                this.props.grains.map((g, key) => (
                                        <SortableItem items={this.props.grains} id={g.id} key={g.id} swap={this.swap}>
                                            <GrainHandler
                                                g={g}
                                                key={key}
                                                keyProps={key}
                                                currentGrain={this.props.currentGrain}
                                                duplicateGrain={(event, id) => this.props.duplicateGrain(event, id)}
                                                changeCurrentGrain={(event, id) => this.props.changeCurrentGrain(event, id)}
                                                onDoubleClickName={(event, key) => this.props.onDoubleClickName()}
                                                deleteGrain={(event, id) => this.props.deleteGrain(event, id)}
                                                addNote={() => this.props.addNote()}
                                                showConfig={() => this.props.showConfig()}
                                                right={this.props.right}
                                                lang={this.props.grain_language}
                                            />                                                                      
                                        </SortableItem>
                                ))

                                :
                                this.props.grains.map((g, key) => (
                                    <GrainHandler
                                        g={g}
                                        key={key}
                                        keyProps={key}
                                        currentGrain={this.props.currentGrain}
                                        duplicateGrain={(event, id) => this.props.duplicateGrain(event, id)}
                                        changeCurrentGrain={(event, id) => this.props.changeCurrentGrain(event, id)}
                                        onDoubleClickName={(event, key) => this.props.onDoubleClickName(event, key)}
                                        deleteGrain={(event, id) => this.props.deleteGrain(event, id)}
                                        addNote={() => this.props.addNote()}
                                        showConfig={() => this.props.showConfig()}
                                        right={this.props.right}
                                        lang={this.props.grain_language}
                                    />                                                                      
                                ))
                        :
                        <Fragment/>
                    }
                </ul>
            </section>
        )
    }
    
}

export default AddGrain