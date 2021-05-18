import React, {Fragment, Component} from 'react'

import BlockHtmlContainer from '../../Components/trainingArea/BlockHtmlContainer'

import { SortableItem, swapArrayPositions } from 'react-sort-list'

import { Translation } from 'react-i18next'

import './TrainingArea.scss'
import {fetchApi} from "../../Utils/Fetch";

class TrainingArea extends Component{

    async switchPosition(){
        let response = await fetchApi('block/position', 'POST', true, {
            id: this.props.id_grain,
            htmls: this.state.htmls
        })


        if (response){
            let data = await response
        }
    }

    async getLanguage(lang, key){
        if (this.state !== null && this.state.htmls[key] !== undefined) {
            let {htmls} = this.state

            htmls[key].language_use = `undefined`
            let response = await fetchApi(`training_language/get_one?lang=${lang}`, 'GET')

            if (response){
                let data = await response
                let {htmls} = this.state

                htmls[key].language_use = `(${data.label} - ${data.iso_code_6393})`

                this.setState({htmls})
            }
        }
    }

    swap = async(dragIndex, dropIndex) => {
        if (this.state.htmls !== undefined && dragIndex !== undefined && dropIndex !== undefined){
            let swappedHtmls = await swapArrayPositions(this.state.htmls, dragIndex, dropIndex)

            await this.setState({htmls: swappedHtmls})

            let dragover = document.getElementsByClassName('dragover');

            for (let i = 0; i < dragover.length; i++) {
                const over = dragover[i];
                over.style.height = '40px'
                over.style.border = 'none'
                over.style.position = 'absolute'
            }

            await this.switchPosition()
        }
    }

    constructor(props){
        super(props)
        this.state = {
            htmls: props.htmlCode
        }
        this.swap = this.swap.bind(this)
    }

    componentWillReceiveProps(props, prevProps){
        if (props.htmlCode !== prevProps){
            this.setState({htmls: props.htmlCode})
        }
    }


    componentWillMount = async() => {
        await this.getLanguage(this.props.grain_language)
    }



    drop = (e, position) => {
        if (e.dataTransfer.getData('block') !== '' && e.dataTransfer.getData('block') !== undefined && e.dataTransfer.getData('block') !== null) {
            e.preventDefault()
            let target = e.target
            if (!target.classList.contains('cle-drop-zone')) {
                target.style.border = 'none'
                target.style.height = '40px'
                target.style.position = 'absolute'
            }
            const block = e.dataTransfer.getData('block')

            this.props.currentBlock(e, block, position);
        }
    }



    dragOver = e => {
        e.preventDefault()
    }

    dragOverBlock = e => {
        e.preventDefault()
        if (e.dataTransfer.types !== '' && e.dataTransfer.types !== undefined && e.dataTransfer.types !== null) {
            let target = e.target
            target.style.border = '2px dotted black'
            target.style.height = '8.5em'
            target.style.position = 'relative'
        }
    }

    dragExit = e => {
        e.preventDefault()
        let target = e.target
        target.style.border = 'none'
        target.style.height = '40px'
        target.style.position = 'absolute'
    }

    render(){
        let dropBox = document.getElementsByClassName('dropBox');
        if (dropBox !== undefined) {
            for (let i = 0; i < dropBox.length; i++){
                dropBox[i].style.width = '100%'
            }
        }
        return (
            <div className='ui-layout-center ui-layout-pane ui-layout-pane-center' id='cle-container'>
                <div id='cle-inner-container'>
                    {
                        this.props.skinPath !== undefined ?
                            <link rel='stylesheet' type='text/css' href={process.env.PUBLIC_URL + '/assets/skins/' + this.props.skinPath + '/style.css'}/>
                            :
                            <Fragment/>
                    }
                    {
                        this.props.submitBlock !== undefined ?
                            document.getElementsByClassName('react-swipeable-view-container')[0].style.transform = 'translate(0%)' : <Fragment/>
                    }
                    {
                        this.props.newBlock !== undefined ?
                            document.getElementById('block_' + this.props.selectedBlock) ? document.getElementById('block_' + this.props.selectedBlock).scrollIntoView({ behavior: 'smooth', block: 'center' }) : <Fragment />
                            :
                            <Fragment/>
                    }

                    {
                        this.state.htmls !== '' ?
                            <Fragment>
                                <header id='header'/>
                                <main id='main'>
                                    <ul id='cle-block-list' className='ui-sortable ui-droppable'>
                                        {
                                            this.state.htmls instanceof Array ?
                                                this.state.htmls.map((html, key) => (
                                                    html !== undefined ?
                                                        <SortableItem items={this.state.htmls} id={html.id} key={html.id} swap={this.swap}>
                                                            <BlockHtmlContainer
                                                                is_editor={this.props.right.is_editor}
                                                                lang={this.props.grain_language}
                                                                getLang={(lang, key) => this.getLanguage(lang, key)}
                                                                html={html}
                                                                key={html.id}
                                                                keyProps={key}
                                                                selected={`${this.props.selectedBlock === html.id ? 'selected-block' : 'unselected'}`}
                                                                onclick={(event, id, block) => this.props.selectNewBlock(event, id, block)}
                                                                onDeleteBlock={() => this.props.onDeleteBlock()}
                                                                openSender={() => this.props.openSender()}
                                                                duplicateBlock={() => this.props.duplicateBlock()}
                                                                dragOverBlock={(e) => this.dragOverBlock(e)}
                                                                dragExit={(e) => this.dragExit(e)}
                                                                onDrop={(e, position) => this.drop(e, position)}
                                                            />
                                                        </SortableItem>
                                                        :
                                                        <Fragment />
                                                ))
                                                :

                                                <Fragment />
                                        }
                                    </ul>
                                    {
                                        this.props.right !== undefined && this.props.right.is_editor ?

                                            <div id={this.props.id} className='cle-drop-zone ui-droppable' onDrop={(e) => this.drop(e)} onDragOver={this.dragOver}>
                                                <Translation>{(t) => <p>{t('_DROP_ZONE')}</p>}</Translation>
                                            </div>
                                            :
                                            <Fragment />
                                    }
                                </main>
                                <footer id='footer'/>
                            </Fragment>
                            :
                            <Fragment />

                    }
                </div>
            </div>
        )
    }

}

export default TrainingArea