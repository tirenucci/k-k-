import React, { Component, Fragment } from 'react'

//Utilitaire
import Button from '../formWidget/Button'

//Style
import './FreeLibrary.scss'
import {fetchApi} from "../../Utils/Fetch";

class FreeLibrary extends Component {

    state = {
        word: ''
    }

    handleChange = (event) => {
        let {word} =  this.state
        word = event.target.value
        this.setState({word})
    }

    async getAllImage() {
        let response = await fetchApi(`media/image/free?word=${this.state.word}`, 'GET')

        if (response){
            let images = await response
            this.setState({images})
        }
    }

    handleKeypressed = async(event) => {
        if (event.key === 'Enter') {
            await this.getAllImage()
        }
    }

    render(){
        return(
            <section className='free__library'>
                <div className='free__librairie__article'>
                    <article className='free__librairie__header'>
                        <div className='free__librairie__title'>
                            <h2>Rechercher une image</h2>
                            <Button
                                className='close__btn'
                                buttonTitle='_CLOSE'
                                type='button'
                                onClick={(event) => this.props.onClose(event)}
                            />
                        </div>
                        <div className='free__librairie__searchbar'>
                            <h2>Entrer un mot clé : </h2>
                            <div className='input-search'>
                                <input id='search' value={this.state.word} onChange={(event) => this.handleChange(event)} onKeyPress={(event) => this.handleKeypressed(event)} />
                                <span className='search-ico' onClick={() => this.getAllImage()}/>
                            </div>
                        </div>
                    </article>
                    <article className='free__librairie__result'>

                        {
                            this.state.word !== '' ?
                                this.state.images !== undefined ?
                                    this.state.images.map((image) => (
                                        image['name'].includes(this.state.word) ?
                                            <img src={image['path']} onDoubleClick={() => this.props.selectImage(image['path'])} alt={image['name']}/>
                                        :
                                            <Fragment/>
                                    ))
                                :
                                <Fragment/>
                            :
                                <p>Entrez un mot clé dans le moteur de recherche pour trouver l'image qu'il vous faut.</p>
                        }
                    </article>
                </div>
            </section>
        )
    }
}

export default FreeLibrary