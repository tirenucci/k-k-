import React, {Fragment} from 'react'
import BlockSkeleton from './BlockSkeleton'

import ContentHelp from './General/ContentHelp'
import Fields from "../Components/formWidget/Fields";

class BlockStatement extends BlockSkeleton{
    constructor(props){
        super(props);
        this.state = {
            lang: props.lang,
            position: props.nbBlock,
            disableButton: true,
            type: '_QUIZ_TITLE',
            options: {
                similar: false,
                description: '_QUIZ_DESC' 
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

    Content = () => {
        return(
            <ul className='content-list'>
                <Fields
                    htmlFor='EnonceDescription'
                    value={this.state.options.description}
                    onChange={(event) => this.handleChange(event, 'description')}
                    inputType='text'
                />
            </ul>
        )
    }

    Options = () => {}

    Help = () => {
        return(
            <Fragment>
                <h3>Énoncé</h3>
                <ContentHelp>
                    <p>Saisissez l’énoncé de votre question. Enregistrez. Si un bloc réponse est associé à cet énoncé sélectionnez-le pour le configurer.</p>
                </ContentHelp>
            </Fragment>
        )
    }

    render(){
        return(
            super.render()
        )
    }
}

export default BlockStatement