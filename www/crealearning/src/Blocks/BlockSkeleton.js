import React, { Component, Fragment } from 'react'

//For BlockSkeleton only
import Content from './General/Content'
import Options from './General/Options'
import Help from './General/Help'

//Utilitaires
import Button from '../Components/formWidget/Button'
import NavBarSecondary from '../Components/NavBarSecondary'
import DeleteModal from '../Components/modal/DeleteModal'

//Style
import './Blocks.scss'
import {fetchApi} from "../Utils/Fetch";

class BlockSkeleton extends Component {

    state = {
        isDelete: false
    }

    componentDidMount(){
        this.setState({disableButton: true})
        this.setState({isDelete: this.props.askDelete})
        this.Tabs()
    }

    handleChange(event, target, checkbox, data) {
        let {options} = this.state
        if (undefined !== checkbox)
        {
            options[target] = event.target.checked;
            this.setState({options})
        }
        else if(undefined !== data)
        {
            options[target] = data
            console.log("2", options[target])
            this.setState({options})
        }
        else
        {
            options[target] = event.target.value;
            this.setState({options})
        }
        if (this.state.disableButton === true){
            this.setState({disableButton: false})
        }
    }

    evenement = (tabs) => {
        this.setState({currentTab: tabs})
    } 

    Content = () => {}

    Options = () => {}

    Help = () => {}

    async deleteBlock(){
        let response = await fetchApi('block/delete', 'DELETE', true, {
            id: this.props.id_block
        })


        if (response){
            await this.props.newBlock()
            this.setState({isDelete: false})
            this.props.delete()

        } else {

            if (response.status === 404) {
                console.log('L\'erreur la plus probable c\'est que l\'id n\'est pas bon : ' + this.props.id_block)
            }
        }
    }

    async sendBlockToBack(){
        let response = await fetchApi('block/save', 'POST', true, {
            lang: this.state.lang,
            options: this.state.options,
            id: this.props.id_block !== undefined ? this.props.id_block : null,
            position: this.props.position !== undefined ? this.props.position : this.state.position,
            type: this.state.type,
            grain_id: this.props.id_grain,
            media: this.state.media !== undefined ? this.state.media : null,
            newBlock: !this.state.disableButton
        })
        
        if (response){
            const informationBlock = await response
            let type = this.state.type
            if (this.state.media && this.props.id !== undefined){
                window.location.reload()
            }

            if (type === "_PDF_READER") {
                window.location.reload()
            }

            await this.props.newBlock(informationBlock.id, !this.state.disableButton)
            await this.getBlockContent(informationBlock.id)
        }
    }

    onCancelDelete(){
        this.setState({isDelete: false})
        this.props.delete()
    }

    async getBlockContent(id = undefined){
        let response = await fetchApi(`block/get?lang=${this.state.lang}&id=${id === undefined ? this.props.id_block : id}`, 'GET')
        
        if (response){
            const state = await response
            this.setState(state)
        }
    }

    Tabs = () => {
        this.setState({currentTab:'CONTENU', tabs: [
            {'text': '_CONTENT', 'class': 'tab__link actif', 'link': '#contenu', 'id': 'CONTENU','type': 'CONTENU'},
            {'text': 'Options', 'class': 'tab__link', 'link': '#options', 'id': 'OPTIONS','type': 'OPTIONS'},
            {'text': '_HELP', 'class': 'tab__link', 'link': '#aide', 'id': 'AIDE','type': 'AIDE'},
        ]})
    }

    componentDidUpdate = async(prevProps, prevState, snapshot) => {

        if (prevProps.askDelete !== this.props.askDelete){
            await this.setState({isDelete: this.props.askDelete})
        }
        if (prevProps.id_block !== this.props.id_block){
            await this.getBlockContent(this.props.id_block)
        }
    }

    render () {
        return (
             <Fragment>
                 {
                     this.state.isDelete ?
                        <DeleteModal onAnnul={() => this.onCancelDelete()} onOk={() => this.deleteBlock()}/> 
                    :
                        <Fragment/>
                 }
                <NavBarSecondary className='blocks__menu' tabs={this.state.tabs} evenement={(tabs) => this.evenement(tabs)}/>
                {
                    this.state.currentTab === 'CONTENU' ? 
                        <Content>
                            {this.Content()}
                            <ul className='btn__list'>
                                {
                                    this.state.non_register ?
                                        <Fragment />
                                    :

                                        <li>
                                            <Button
                                                className='orange__btn'
                                                type='submit'
                                                buttonText='_SAVE'
                                                onClick={() => this.sendBlockToBack()}
                                                disable={this.state.disableButton}
                                            />
                                        </li>
                                }
                                <li>
                                    <Button
                                        className='grey__btn'
                                        type='reset'
                                        buttonText='_DELETE'
                                        onClick={() => this.setState({isDelete: true})}
                                    />
                                </li>
                            </ul>
                        </Content>
                    : 
                        <Fragment/>
                }
                {
                    this.state.currentTab === 'OPTIONS' ?
                        <section className='options__section'>
                            <ul className='options-list'> 
                                <Options checked={this.state.options.similar} oncheck={(event, target) => this.handleChange(event, 'similar', true)}>
                                    {this.Options()}
                                </Options>
                            </ul>
                            <ul className='btn__list'>
                                <li>
                                    <Button
                                        className='orange__btn'
                                        type='submit'
                                        buttonText='_SAVE'
                                        onClick={() => this.sendBlockToBack(true)}
                                        disable={this.state.disableButton}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='grey__btn'
                                        type='reset'
                                        buttonText='_DELETE'
                                        onClick={() => this.setState({isDelete: true})}
                                    />
                                </li>
                            </ul>
                        </section>  
                     : <Fragment/>
                }
                {
                    this.state.currentTab === 'AIDE' ?
                        <Help>
                            {this.Help()}
                        </Help>
                    : 
                        <Fragment/>
                }
                </Fragment>
        )
    }
}

export default BlockSkeleton