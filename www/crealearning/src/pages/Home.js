/**
 * GLOBAL = Components utilisés pour plusieurs HOC
 * HOC = Higher Order Component ou component principal
 * Component utilitaire = Component utilisé à répétition dans l'application
 * La balise Fragment permet d'englober deux components qui n'auraient pas de balises principales
 * La balise Fragment permet également de déclarer du vide dans certaines conditions
 * Les fichiers styles sont toujours associés au component
 * Les roles sur les balises permettent de structurer la page et d'améliorer l'accessibilité
 */

import React, { Component, Fragment, lazy, Suspense } from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'
//i18n
//La balise Translation permet de traduire des éléments dans le HOC
import { Translation } from 'react-i18next'

//GLOBAL
//Section englobant tout les components
import MainSection from '../Components/MainSection'
//Barre de navigation + logo dans le header à droite
import NavBar from '../Components/NavBar'
//Avatar + menu + config dans le header à gauche
import UserMenu from '../Components/home/UserMenu'
//Le footer
import Footer from '../Components/home/Footer'

//MODAL
//Fenêtre pour la sélection de l'avatar lors de la première connection
import ChangeAvatar from '../Components/modal/ChangeAvatar'
//Fenêtre invitant l'SSID à changer d'offre selon la fonctionnalité
import ModalSubscriber from '../Components/modal/ModalSubscriber'

//Style
import './Home.scss'
import HomeBlock from '../Components/home/HomeBlock'
import Loader from '../Components/modal/Loader'

import {FileManager, FileNavigator} from '@opuscapita/react-filemanager'
import FileManagerConnector from "../FileManager/ApiConnector";
import ViewLayoutOptions from "../FileManager/ViewLayoutOptions";
import ListViewLayout from "../FileManager/ListViewLayout";
import {getUserInformation} from "../Utils/GetUserInformation";
import {fetchApi} from "../Utils/Fetch";
import Header from "../Components/Header";


class Home extends Component {

    // Dans le constructeur on initie les states pour récuperer l'SSID avant tout affichage
    constructor ({props}) {
        super(props)
        this.state = {
            redirect: false,
            modalShow: false,
            //Charge un avatar par défaut si l'SSID n'en choisit aucun
            img_selected: {
                path: '/assets/img/avatar/default.svg',
                name: 'default',
                id: 1
            },
            //Permet de stocker tout les avatars dans un tableau
            avatars: [],
        }
    }





    componentDidMount = async() => {
        await getUserInformation().then(r => this.setState({user: r}))
        document.body.className='body' //On enlève la classe présente sur la page de connection pour ne pas conserver le background
        document.title = this.props.title // title est le state donner lors de la création de la route (voir App.js)
    }

    async isAvatarChange() {
        this.setState({changeAvatar: !this.state.changeAvatar})
    }

    render () {
        //Eléments 'CRÉER' et 'VOIR'
        const HomeBlock = lazy(() => import('../Components/home/HomeBlock'))
        const HomeBlockLink = lazy(() => import('../Components/home/HomeBlockLink'))
        const renderLoader = () => <Loader/>;

        if (this.state.redirect){
            return <Redirect to='/connection'/> //Component permettant la redirection
        }
            const { modalShow} = this.state //Initie les states dans le HOC
            return (
                undefined !== this.state.user ?
                    <div id='container'>
                        <Header />
                        <MainSection
                                additionalClass='home__page'
                                titleText='_HELLO'
                                value={this.state.user !== undefined ? this.state.user.username : null}
                                >
                            {
                                this.state.importModal ?
                                    <ModalSubscriber
                                        bkgd='import__bkgd'
                                        modalTitle='_IMPORT'
                                        onClose={() => this.setState({importModal:false})}
                                    >
                                    <Translation>
                                        { //La balise Translation attends la méthode t pour traduire
                                            (t)=><p>{t('_LOCK_IMPORT_ACCESS_1')}<span>Pro</span>{t('_AND')}<span>{t('_CUSTOMER_ORG')}</span>{t('_LOCK_IMPORT_ACCESS_2')}<hr/>{t('_LOCK_CONTACT')}</p>
                                        }
                                    </Translation>
                                    </ModalSubscriber>
                                :
                                this.state.authorModal ?
                                    <ModalSubscriber
                                        bkgd='author__bkgd'
                                        modalTitle='_LOCK_AUTHOR_TRAINING'
                                        onClose={() => this.setState({authorModal:false})}
                                    >
                                    <Translation>
                                        {
                                            modalShow ? //Si true on affiche le component pour la sélection de l'avatar
                                                <ChangeAvatar
                                                    selectHandler={(event, avatar) => this.selectHandler(event, avatar)}
                                                    allImages={this.state.avatars}
                                                    selectedImage={this.state.img_selected}
                                                    onClose={() => this.setState({modalShow: false})}
                                                    choiceHandle={() => this.changeAvatar()}
                                                    uploadAvatar={(e) => this.uploadAvatar(e)}
                                                />
                                                :
                                                <Fragment/>
                                        }
                                    </Translation>
                                    </ModalSubscriber>
                                :
                                this.state.skinModal ?
                                    <ModalSubscriber
                                        bkgd='skin__bkgd'
                                        modalTitle='_LOCK_SKIN'
                                        onClose={() => this.setState({skinModal:false})}
                                    >
                                    <Translation>
                                        {
                                            (t)=><p>{t('_LOCK_AUTHOR_TRAINING_ACCESS_1')}<span>{t('_CUSTOMER_ORG')}</span>{t('_LOCK_SKIN_ACCESS')}<hr/>{t('_LOCK_CONTACT')}</p>
                                        }
                                    </Translation>
                                    </ModalSubscriber>
                                :
                                this.state.libraryModal ?
                                    <ModalSubscriber
                                        bkgd='lib__bkgd'
                                        modalTitle='_LIB_TITLE'
                                        onClose={() => this.setState({libraryModal:false})}
                                    >
                                    <Translation>
                                        {
                                            (t)=><p>{t('_LOCK_AUTHOR_TRAINING_ACCESS_1')}<span>{t('_CUSTOMER_ORG')}</span>{t('_LOCK_LIB_ACCESS')}<hr/>{t('_LOCK_CONTACT')}</p>
                                        }
                                    </Translation>
                                    </ModalSubscriber>
                                :
                                <Fragment/>
                            }
                                <ul className='home__list__btn'>
                                <Suspense fallback={renderLoader()}>
                                    <HomeBlock
                                        blockType='add'
                                        link='/create'
                                        textLink='_HOME_BTN_CREATE_1'
                                        spanText='_HOME_BTN_CREATE_2'
                                    />
                                    <HomeBlock
                                        blockType='list'
                                        link='/trainings'
                                        textLink='_HOME_BTN_SEE_1'
                                        spanText='_HOME_BTN_SEE_2'
                                    />
                                    <HomeBlockLink
                                        offer={'Pro'}
                                        openImportSubscriber={() => this.setState({importModal:true})}
                                        openAuthorSubscriber={() => this.setState({authorModal:true})}
                                        openSkinSubscriber={() => this.setState({skinModal:true})}
                                        openLibrarySubscriber={() => this.setState({libraryModal:true})}
                                    />
                                    </Suspense>
                                </ul>
                            </MainSection>
                        <Footer/>
                    </div>
                :
                    <Fragment />
            )
        
    }
}

export default Home