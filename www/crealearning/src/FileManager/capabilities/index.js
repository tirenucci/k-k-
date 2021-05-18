import createFolder from './create-folder';
import deleteResource from './delete-resource';
import download from './download';
import upload from './upload';
import rename from './rename';
import sort from './sort';

const capabilities = [
    createFolder,
    rename,
    upload,
    deleteResource,
    sort
];

const capabilitiesFree = [
    sort
];

/**
 * Actions' fields list:
 *  showDialog,
 *  hideDialog,
 *  navigateToDir,
 *  updateNotifications,
 *  getSelection,
 *  getSelectedResources,
 *  getResource,
 *  getResourceChildren,
 *  getResourceLocation,
 *  getNotifications,
 *  getSortState
 *
 *  Called from FileNavigator (componentDidMount() and componentWillReceiveProps())
 *
 * @param apiOptions
 * @param {object} actions
 * @returns {array}
 */
export default (apiOptions, actions) => (
    apiOptions.lib !== '/free/' ?
        capabilities.map(capability => capability(apiOptions, actions))
    :
        capabilitiesFree.map(capability => capability(apiOptions, actions))
);