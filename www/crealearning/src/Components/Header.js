import React, {Fragment} from 'react'
import NavBar from "./NavBar";
import UserMenu from "./home/UserMenu";

import cookie from 'react-cookies'
import './Header.scss'
import {fetchApi} from "../Utils/Fetch";
import ChangeAvatar from "./modal/ChangeAvatar";
import {getUserInformation} from "../Utils/GetUserInformation";

class Header extends React.Component {

    state = {
        is_logipro: false,
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
        updateAvatar: false,
        user: []
    }

    componentDidMount = async() => {
        await getUserInformation().then(r => this.setState({user: r}))
        if (cookie.load('crea_oldcookie') !== undefined) {
            let response = await fetchApi(`user/is_logipro?user=${btoa(cookie.load('crea_oldcookie'))}`, 'GET', true)

            if (response) {
                this.setState({is_logipro: response['is_logipro']})
            }
        }
        if (this.state.user.avatar === null) {
            this.setState( {modalShow: true})
            await this.getAvatars()
        }
    }

    reverseAccount() {
        cookie.save('SSID', cookie.load('crea_oldcookie'), {
            path: '/'
        })

        cookie.remove('crea_oldcookie', {
            path: '/'
        })

        window.location.reload()
    }

    //Pour la sélection de l'avatar
    selectHandler = (event, avatar) => {
        const img_selected = avatar
        this.setState({img_selected})
    }


    //Permet de récuperer tout les avatars
    async getAvatars(){
        if (this.state.modalShow === true){
            let response = await fetchApi('user/take_all_avatars', 'GET')

            if (response){
                let avatars = await response
                this.setState({avatars})
            }
        }
    }


    async uploadAvatar(e){
        // On doit envoyer l'image par un formulaire avec FormData() pour la récuperer avec Symfony
        let formData = new FormData()
        formData.append('image', e.target.files[0])
        let response = await fetchApi('user/profile/upload_avatar', 'POST', true, formData, false)

        if (response)
        {
            let data = await response
            this.setState({img_selected: data})
            await this.getAvatars()
        }
    }

    // Changement de l'avatar au niveau du back
    async changeAvatar(){
        let response = await fetchApi('user/profile/change_avatar', 'PUT', true, {
            avatar_id: this.state.img_selected.id,
            user_id: this.state.user.id
        })

        if (response){
            await response
            this.setState({modalShow: false, updateAvatar: true})
        }
    }

    handleChangeAvatar = async() => {
        await this.setState({updateAvatar: false})
    }

    render() {
        return (
            <Fragment>
                <header className='main__header'>
                    <NavBar
                        is_logipro={this.state.is_logipro}
                        reverseAccount={() => this.reverseAccount()}
                    />
                    <UserMenu
                        updateAvatar={this.state.updateAvatar}
                        setChangeAvatar={() => this.handleChangeAvatar(false)}
                    />
                </header>
                {
                    this.state.modalShow ? //Si true on affiche le component pour la sélection de l'avatar
                        <ChangeAvatar
                            selectHandler={(event, avatar) => this.selectHandler(event, avatar)}
                            allImages={this.state.avatars}
                            selectedImage={this.state.img_selected}
                            onClose={() => this.setState({modalShow: false})}
                            choiceHandle={() => this.changeAvatar()}
                            uploadAvatar={(e) => this.uploadAvatar(e)}
                        />
                        :
                        <Fragment />
                }

            </Fragment>
        );
    }
}

export default Header