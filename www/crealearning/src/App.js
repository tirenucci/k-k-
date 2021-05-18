import React from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from 'react-router-dom'
import cookie from 'react-cookies'
import { withTranslation } from 'react-i18next'

import Home from './pages/Home'
import GeneralLibrary from './pages/GeneralLibrary'
import UserProfile from './pages/UserProfile'
import BlockPage from './pages/BlockPage'
import Users from './pages/Users'

/** CONNECTION */
import Connection from './pages/Connection'
import ResetPassword from './pages/ResetPassword'

/** IMPORT TRAINING */
import TrainingsList from './pages/TrainingsList'
import CreateTraining from './pages/CreateTraining'
import TrainingOption from './pages/TrainingOption'
import ImportTraining from './pages/ImportTraining'

/** IMPORT SKIN */
import SkinImport from './pages/skin/SkinImport'
import SkinForm from './pages/skin/SkinForm'
import DisplayOne from './pages/skin_theme/DisplayOne'

/** IMPORT SKIN THEME  */
import DisplayAll from './pages/skin_theme/DisplayAll'
import SkinThemeCreator from './pages/skin_theme/SkinThemeCreator'

/**PREVIEW */
import Preview from './pages/preview/Preview'

/**CONFIGURATION */
import ConfigLang from './pages/config/ConfigLang'
import EOManager from './pages/config/EOManager'
import UserManager from './pages/UserManager'
import SocietyManager from './pages/SocietyManager'
import EditTheme from './Components/config/EditTheme'

import VideoCypress from './pages/VideoCypress'
import NewUser from "./pages/userManager/NewUser";
import EditUser from "./pages/userManager/EditUser";
import ConfigSociety from "./pages/config/ConfigSociety";

window.$user = cookie.load('SSID')

function App({t}) {
	return (
		<Router>
			<Switch>
				{/**CONNECTION ROUTE */}
				<Route exact path='/connection/' render={
					props => (
						<Connection title={t('_TITLE_LOG')}/>
					)
				}/>
				<Route exact path='/connection/:token/' component={
					(props) => (
						<ResetPassword title={t('_TITLE_LOG')} match={props.match} location={props.location}/>
					) 
				} />
				<Route exact path='/connection/reset/:token'  component={(props) => (
						<ResetPassword title={t('_TITLE_LOG_RESET')} match={props.match}/>
					)
				}/>

				{/**HOME ROUTE */}
				<Route exact path='/' render={
					props => (
						<Home title={t('_TITLE_HOME')}/>
					)
				}/>

				{/**LIBRARY ROUTE */}
				<Route exact path='/general-librairie' render={
					props => (
						<GeneralLibrary title={t('_TITLE_LIBRARY')}/>
					)
				}/>

				{/**Users ROUTE */}
				<Route exact path='/authors' render={
					props => (
						<Users title={t('_TITLE_USERS')}/>
					)
				}/>

				{/**PROFILE ROUTE */}
				<Route exact path='/profile' render={
					props => (
						<UserProfile title={t('_TITLE_PROFILE')}/>
					)
				}/>


				{/**CONFIG EO ROUTE */}
				<Route exact path='/EOManager' component={(props) => (
						<EOManager title={t('_TITLE_EO_LIST')} location={props.location}/>
					)
				}/>
				<Route exact path='/EOManager/newTheme' component={(props) => (
						<EOManager title={t('_TITLE_EO_THEME_NEW')} location={props.location}/>
					)
				}/>
				<Route exact path='/EOManager/theme/edit/:id/' component={(props) => (
					<EditTheme title={t('_TITLE_EO_EDIT_THEME')} match={props.match} location={props.location}/>
				)} />
				<Route exact path='/EOManager/newEO/:theme' component={(props) => (
						<EOManager title={t('_TITLE_EO_NEW')} location={props.location} match={props.match}/>
					)
				}/>
				<Route exact path='/EOManager/edit/:id' component={(props) => (
						<EOManager title={t('_TITLE_EO_EDIT')} location={props.location} match={props.match}/>
					)
				}/>

				{/**CONFIG LANG ROUTE */}
				<Route exact path='/configLang' render ={ props => (
						<ConfigLang title={t('_CONFIG_LANG_TITLE')}/>
					)
				}/>

				{/**CONFIG USER MANAGEMENT ROUTE */}
				<Route exact path='/userManager' component={(props) => (
						<UserManager title={t('_TITLE_USER_MANAG')} location={props.location}/>
					)
				}/>
				<Route exact path='/userManager/add' component={(props) => (
						<NewUser title={t('_TITLE_USER_MANAG_ADD')} location={props.location}/>
					)
				}/>
				<Route exact path='/userManager/edit/:id' component={(props) => (
						<EditUser title={t('_TITLE_USER_MANAG_EDIT')} location={props.location} match={props.match}/>
					)
				}/>

				{/**CONFIG SOCIETY MANAGER ROUTE */}
				<Route exact path='/societyManager' component={(props) => (
					<SocietyManager title={t('_TITLE_SOCIETY_MANAG')} location={props.location}/>
				)
				}/>
				<Route exact path='/societyManager/add' component={(props) => (
					<SocietyManager title={t('_TITLE_SOCIETY_MANAG_ADD')} location={props.location}/>
				)
				}/>
				<Route exact path='/societyManager/edit/:id' component={(props) => (
					<SocietyManager title={t('_TITLE_SOCIETY_MANAG_EDIT')} location={props.location}  match={props.match}/>
				)
				}/>

				{/**TRAINING ROUTE */}
				<Route exact path='/trainings' component={(props) => (
						<TrainingsList title={t('_TITLE_TRAINING_LIST')} location={props.location}/>
					)
				}/>
				<Route exact path='/create' render={
					props => (
						<CreateTraining title={t('_TITLE_CREATE_TRAINING')}/>
					)
				}/>
				<Route exact path='/importTraining' component={(props) => (
						<ImportTraining title={t('_TITLE_IMPORT_TRAINING')} match={props.match} location={props.location}/>
					)
				}/>
				<Route exact path='/training/:id/option' component={(props) => (
						<TrainingOption title={t('_TITLE_SET_TRAINING')} match={props.match} location={props.location}/>
					)
				}/>

				{/**SKIN ROUTE */}
				<Route exact path='/skin/import/:theme/' component={
					(props) => (
						<SkinImport title={t('_TITLE_IMPORT_SKIN')} match={props.match} location={props.location}/>
					) 
				} />
				<Route exact path='/skin/:skin/' component={(props) => (
						<SkinForm title={t('_TITLE_SKIN')} match={props.match} location={props.location}/>
					)
				}/>

				{/**SKIN THEME ROUTE */}
				<Route exact path='/skintheme' component={(props) => (
						<DisplayAll title={t('_TITLE_SKIN_THEME')} match={props.match} location={props.location}/>
					)
				}/>
				<Route exact path='/skintheme/new' render={
					props => (
						<SkinThemeCreator title={t('_TITLE_SKIN_NEW')}/>
					)
				}/>
				<Route exact path='/skintheme/:id' component={
					(props) => (
						<DisplayOne title={t('_TITLE_SKIN')} match={props.match} location={props.location}/>
					)
				}/>
				<Route exact path='/skin/import/:id' component={
					(props) => (
						<SkinImport title={t('_TITLE_SKIN_IMPORT')} match={props.match} location={props.location}/>
					)
				}/>

				{/**EDIT TRAINING ROUTE */}
				<Route exact path='/training/:id' component={(props) => (
						<BlockPage title={t('_TITLE_EDIT_TRAINING')} match={props.match}/>
					)
				}/>

				{/**SKIN THEME ROUTE */}
				<Route exact path='/import' render ={ props => (
						<ImportTraining title={t('_TITLE_IMPORT_TRAINING')}/>
					)
				}/>

				{/**PREVIEW ROUTE */}
				<Route exact path='/training/preview/:id' render ={ props => (
						<Preview title={t('')} match={props.match} location={props.location}/>
					)
				}/>

				{/** CONFIG SOCIETY */}
				<Route exact path={'/society-config'} render={props => (
					<ConfigSociety />
				)} />

				{/*<Route component={NotFound} />*/}


				<Route exact path='/videos' component={VideoCypress}/>

			</Switch>
		</Router>
	)
}

export default withTranslation()(App)
