import React, {Fragment} from 'react'

//i18n
import { Translation } from 'react-i18next'

//Structure
import BlockSkeleton from './BlockSkeleton'

//Utilitaires
import Button from '../Components/formWidget/Button'
import Fields from '../Components/formWidget/Fields'
import FileManagerModal from "../Components/modal/FileManagerModal";

class BlockPDF extends BlockSkeleton{

    constructor(props){
        super(props);
        this.state = {
            lang: props.lang,
            fileManager: false,
            position: props.nbBlock,
            disableButton: true,
            media: true,
            type: '_PDF_READER',
            options: {
                url: '',
                width: '',
                height: '',
                similar: false
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
    }

    validImage(url) {
        let {options} = this.state

        options.url = url.replace('//', '/')


        this.setState({options, fileManager: false, disableButton: false})
    }

    Content = () => {
        return(
            <Fragment>
                { this.state.fileManager ? <FileManagerModal onlyType={'pdf'} validImage={(url) => this.validImage(url)}  training={this.props.trainingUuid} title={"Bibliothèque"} changeUrl={(url) => this.handleUrlChange(url)} onAnnul={() => this.setState({fileManager: false})} /> : <Fragment /> }
                <ul className='content-list'>
                    <Fields
                        liClass='content-element wrap'
                        htmlFor='source'
                        text='_PDF_SOURCE'
                        inputType='text'
                        value={this.state.options.url}
                    >
                        <Button
                            className='folder__btn'
                            buttonType='button'
                            buttonTitle='_SELECT_FILE'
                            onClick={() => this.setState({fileManager: true})}
                        />
                    </Fields>
                    <li>
                        <ul className='one__row'>
                            <Fields
                                liClass='content-element'
                                htmlFor='width'
                                text='_WIDTH'
                                inputType='text'
                                value={this.state.options.width}
                                onChange={(event) => this.handleChange(event, 'width')}
                            >
                                &nbsp;px
                            </Fields>
                            <Fields
                                liClass='content-element'
                                htmlFor='height'
                                text='_HEIGHT'
                                inputType='text'
                                value={this.state.options.height}
                                onChange={(event) => this.handleChange(event, 'height')}
                            >
                                &nbsp;px
                            </Fields>
                        </ul>
                    </li>
                </ul>
            </Fragment>
        )
    }

    Options = () => {}

    Help = () => {
        return(
            <Translation>
                {
                    (t) => 
                    <Fragment>
                        <h3>{('_PDF')}</h3>
                        <p>Aucune aide disponible pour le moment</p>
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

export default BlockPDF