import React, { Component, Fragment } from 'react'

//Utilitaires
import NavBarSecondary from '../../Components/NavBarSecondary'
import Button from '../../Components/formWidget/Button'
import DeleteModal from '../../Components/modal/DeleteModal'

//ConfigGrainHandler
import ConfigGrain from './ConfigGrain'
import HelpBlock from './HelpBlock'
import {fetchApi} from "../../Utils/Fetch";

class ConfigGrainHandler extends Component {

    state={
        tabs: [
            {'text': '_GRAIN_CONFIG_TITLE', 'class': 'tab__link actif', 'link': '#configGrain', 'type':'configGrain'},
            {'text': '_HELP', 'class': 'tab__link', 'link': '#aide', 'type':'aide'}
        ],
        deleted: false,
        showConfig: false,
        grain: []
    }

    constructor({props}){
        super(props)    
    }

    componentDidMount = async() => {
        await this.getProperty(this.props.grain.id)
        await this.hasQuestion()
    }

    async getProperty(id){
        let response = await fetchApi(`grain/get_property?id=${id}`, 'GET')

        if (response){
            const grain = await response
            this.setState({grain})
        }
    }

    evenement = (tabs) => {
        this.setState({currentTab: tabs})
    }

    async deleteGrain(){
        let response = await fetchApi('grain/delete', 'DELETE', true, {
            id_grain: this.props.grain.id
        })


        if (response){
            this.setState({deleted: false})
            await this.props.getAllGrain()
            await this.props.getHtmlGrain()
        }
    }

    async saveGrain(){
        let response = await fetchApi('grain/update', 'POST', true, {
            id: this.props.grain.id,
            grain: this.state.grain,
            lang: this.props.lang
        })

        if (response){
            await this.props.getAllGrain()
            await this.props.getHtmlGrain()
        }
    }

    handleGrainChange(event, target){
        let {grain} = this.state

        if (target === 'name') {
            grain['name'][this.props.lang] = event.target.value
        }
        else {
            grain[target] = event.target.value
        }

        this.setState({grain})
    }
    
    async hasQuestion(){
        let response = await fetchApi(`grain/has_question?id_grain=${this.props.grain.id}`, 'GET')

        if (response){
            this.setState({has_question: response['has_question']})
        }
    }

    render() {
        return (
                <aside className='notes-navbar'>
                    {
                        this.state.deleted ? 
                            <DeleteModal onOk={() => this.deleteGrain()} onAnnul={() => this.setState({deleted: false})}/> 
                        : 
                            <Fragment/>
                    }
                    <NavBarSecondary
                        tabs={this.state.tabs} 
                        className='tab__menu blocks__tab'
                        evenement={(tabs) => this.evenement(tabs)}
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
                        <ConfigGrain
                            lang={this.props.lang}
                            offer={this.state.offer}
                            grain={this.state.grain}
                            has_question={this.state.has_question}
                            handleGrainChange={(event, target) => this.handleGrainChange(event, target)}
                            saveGrain={() => this.saveGrain()}
                            deleteGrain={() => this.setState({deleted: true})}
                        />
                    }
                </aside>
        )
    }
}

export default ConfigGrainHandler