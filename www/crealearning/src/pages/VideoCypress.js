import React from 'react'
import NavBar from '../Components/NavBar'
import Footer from '../Components/home/Footer'
import Title from '../Components/Title'
import './Home.scss'

import './VideoCypress.scss'

const VideoCypress = () => {
    return (
        <div id='container'>
            <header className='main__header'>
                <NavBar/>
            </header>
            <main id='main' >
                <Title text='Vidéo Cypress'/>
                <section className='video-cypress'>
                    <article>
                        <video controls>
                            <source src='/assets/videos/actions_spec.js.mp4' type='video/mp4' />
                        </video>
                    </article>
                </section>
                <section className='video-cypress'>
                    <article>
                        <video controls>
                            <source src='/assets/videos/training_spec.js.mp4' type='video/mp4' />
                        </video>
                    </article>
                </section>
                <section className='video-cypress'>
                    <article>
                        <video controls>
                            <source src='/assets/videos/block_spec.js.mp4' type='video/mp4' />
                        </video>
                    </article>
                </section>
                <section className='video-cypress'>
                    <article>
                        <video controls>
                            <source src='/assets/videos/responsive_spec.js.mp4' type='video/mp4' />
                        </video>
                    </article>
                </section>
            </main>
            <Footer/>
        </div>
    )
}

export default VideoCypress