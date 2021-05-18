import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'

//Utilitaires
import MainSection from '../Components/MainSection'
import NavBar from '../Components/NavBar'
import UserMenu from '../Components/home/UserMenu'
import Footer from '../Components/home/Footer'

//Style
import './GeneralLibrary.scss'
import {FileManager, FileNavigator} from "@opuscapita/react-filemanager";
import FileManagerConnector from "../FileManager/ApiConnector";
import ApiOptions from "../FileManager/ApiOptions";
import ViewLayoutOptions from "../FileManager/ViewLayoutOptions";
import ListViewLayout from "../FileManager/ListViewLayout";
import capabilities from "../FileManager/capabilities";
import FileManagerModel from "../Components/FileManagerModel";
import Header from "../Components/Header";

class GeneralLibrary extends Component { 
       
    constructor({props}){
        super(props)
    }

    render () {
        
        
        return (
            <div id='container'>
                <Header />
                <MainSection titleText='_LIB_TITLE'>
                    <div>
                        <FileManagerModel
                            lib={[
                                {'label': 'Bibliothèque général', 'name': '/general/'}
                            ]}
                            onlyType={null}
                        />
                        
                    </div>
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default GeneralLibrary