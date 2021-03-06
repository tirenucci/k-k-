import api from '../ApiConnector';
import onFailError from '../utils/OnFailError';

export default (apiOptions, actions) => {
    const {
        updateNotifications,
        getResource,
        getNotifications,
        getSortState // eslint-disable-line no-unused-vars
    } = actions;
    return ({
        id: 'sort',
        shouldBeAvailable: () => true,
        handler: async ({ sortBy, sortDirection }) => {
            const id = getResource().id;
            try {
                return api.getChildrenForId(apiOptions, { id, sortBy, sortDirection });
            } catch (err) {
                onFailError({
                    getNotifications,
                    notificationId: 'rename',
                    updateNotifications
                });
                return null
            }
        }
    });
}