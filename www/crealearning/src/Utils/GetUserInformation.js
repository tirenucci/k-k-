import {fetchApi} from "./Fetch";

export {
    getUserInformation
}


async function getUserInformation(){

    let response = await fetchApi('user/get_information','GET')

    if (response) {
        return await response
    }
}