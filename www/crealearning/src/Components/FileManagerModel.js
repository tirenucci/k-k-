import React, {Component, Fragment} from 'react'

import { Translation } from 'react-i18next'
import {FileManager, FileNavigator} from "@opuscapita/react-filemanager";
import FileManagerConnector from "../FileManager/ApiConnector";
import ApiOptions from "../FileManager/ApiOptions";
import ViewLayoutOptions from "../FileManager/ViewLayoutOptions";
import ListViewLayout from "../FileManager/ListViewLayout";
import capabilities from "../FileManager/capabilities";

import './FileManagerModel.scss'
import {fetchApi} from "../Utils/Fetch";

class FileManagerModel extends Component {

    state = {
        lib: [],
        open: '/general/'
    }

    constructor({props}) {
        super(props);
    }

    componentDidMount = async function(){
        const {lib} = this.props
        this.setState({lib})

        await this.getTree()
    }
    
    getTree = async() => {
        let response = await fetchApi(`get_tree/${btoa(this.state.open)}`, 'GET')

        if (response) {
            const data = await response
            this.setState({tree: data})
        }
    }

    handleClick = (event, name) => {
        let {open} = this.state

        open = name

        this.setState({open})
    }

    handleChangeLocation = async(location) => {
        let {open} = this.state
        open = atob(location)
        this.setState({open})
        await this.getTree()
    }

    render(){
        return(
            <div className={"filemanager"}>
                <ul className={'filemanager-diff'}>
                    {
                        this.state.tree !== null && this.state.tree instanceof Object ?
                            this.state.lib.map((l, key) => (
                                l.name !== '/' + this.state.tree['main'] + '/' ?
                                    <li className={'diff'} onClick={(event) => this.handleClick(event, l.name)} key={key}>{l.label}</li>
                                :
                                    this.state.tree['sub'].length !== 0 ?
                                        this.state.tree['sub'].map((tree, key) => (
                                            <Fragment>
                                                {
                                                    key === 0 ?
                                                        <li onClick={(event) => this.handleClick(event, l.name)} className={`diff ${'/' + this.state.tree['current'] + '/' === l.name ? 'actif': ''}`} key={key}>{l.label}</li>
                                                    :
                                                        <Fragment />
                                                }
                                                <ul>
                                                    <li onClick={(event) => this.handleClick(event, tree.folder)} className={`diff ${this.state.tree['current'] === tree.folderName ? 'actif': ''}  diff-tree-` + parseInt(tree.position + 1)}>{tree.folderName}</li>
                                                </ul>
                                            </Fragment>
                                        ))
                                    :
                                        <li onClick={(event) => this.handleClick(event, l.name)} className={`diff ${'/' + this.state.tree['current'] + '/' === l.name ? 'actif': ''}`} key={key}>{l.label}</li>
                            ))
                        :
                            <Fragment />
                    }
                </ul>
                <FileManager>
                    <FileNavigator
                        api={FileManagerConnector}
                        initialResourceId={btoa(this.state.open)}
                        onResourceItemDoubleClick={
                            resourceItem => resourceItem.rowData.type == 'file' ? this.props.validImage(resourceItem.rowData.thund) : console.log()
                        }
                        apiOptions={{
                            ...ApiOptions,
                            apiRoot: window.$url,
                            locale: 'fr',
                            lib: this.state.open,
                            onlyType: this.props.onlyType
                        }}
                        viewLayoutOptions={{
                            ...ViewLayoutOptions,
                            locale: 'fr'
                        }}
                        onResourceLocationChange={
                          resourceLocation => this.handleChangeLocation(resourceLocation[0]['id'])
                        }
                        listViewLayout={ListViewLayout}
                        capabilities={capabilities}
                    />
                </FileManager>
            </div>
        )
    }
}

export default FileManagerModel