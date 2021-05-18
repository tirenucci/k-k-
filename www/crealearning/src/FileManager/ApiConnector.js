import {fetchApi} from "../Utils/Fetch";

function normalizeResource(resouce) {
    if (resouce) {
        return  {
            capabilities: resouce.capabilities,
            createdTime: Date.parse(resouce.createdTime),
            id: resouce.id,
            modifiedDate: Date.parse(resouce.modifiedDate),
            name: resouce.name,
            type: resouce.type,
            size: resouce.size,
            thund: resouce.thund,
            parentId: resouce.parentId ? resouce.parentId : null,
            ancestor: resouce.ancestor ? resouce.ancestor : null
        }
    }
}

function hasSignedIn() {
    return true;
}

function init() {
    return {
        apiInitialized: true,
        apiSignedIn: true
    }
}

async function getCapabilitiesForResource(options, resource) {
    return resource.capabilities || []
}

async function getResourceById(options, id){
    let response = await fetchApi(`files/${id}`, 'GET')

    if (response) {
        let data = await response

        return normalizeResource(data)
    }
}

async function getChildrenForId(options, {id, sortBy = 'name', sortDirection = 'ASC'}) {
    let response = await fetchApi(`files/${id}/children?orderBy=${sortBy}&orderDirection=${sortDirection}&onlyType=${options.onlyType}`, 'GET', true)

    if (response) {
        let data = await response
        return data.items.map(normalizeResource)
    }
}

async function getParentsForId(options, id, result = []) {
    if (!id) {
        return result
    }

    const resource = await getResourceById(options, id)
    if (resource && resource.ancestor) {
        return resource.ancestor
    }
    return result
}

async function getBaseResource(options) {
    let response = await fetchApi('files', 'GET')

    if (response) {
        let data = await response

        return normalizeResource(data)
    }
}

async function getIdForPartPath(options, currId, pathArr) {
    const resourceChildren = await getChildrenForId(options, {id: currId})
    for (let i = 0; i < resourceChildren.length; i++) {
        const resource = resourceChildren[i]
        if (resource.name === pathArr[0]) {
            if (pathArr.length === 1) {
                return resource.id
            } else {
                return getIdForPartPath(options, resource.id, pathArr.slice(1))
            }
        }
    }
    return null;
}

async function getIdForPath(options, path) {
    const resource = await getBaseResource(options)
    const pathArr = path.split('/')

    if (pathArr.length === 0 || pathArr.length === 1 || pathArr[0] !== '') {
        return null;
    }

    if (pathArr.length === 2 && pathArr[1] === '') {
        return resource.id
    }

    return getIdForPartPath(options, resource.id, pathArr.slice(1))
}

async function getParentIdForResource(options, resource) {
    return resource.parentId
}

async function uploadFileToId({apiOptions, parentId, file, onProgress}) {
    let formData = new FormData()
    formData.append('type', 'file')
    formData.append('parentId', parentId)
    formData.append('file', file.file)
    let response = await fetchApi('files', 'POST', true, formData, false, false)

    if (response.ok) {
        return response;
    }
}

async function downloadResources({apiOptions, resources, onProgress}) {
    const downloadUrl = resources.reduce(
        (url, resource, num) => url + (num === 0 ? '': '&') + `items=${resource.id}`,
        `${window.$url}download`
    )
    let res = await fetchApi(downloadUrl, 'GET', true, undefined, true, false)

    if (res.ok) {
        let data = await res.blob()
        return data.body
    }
}

async function createFolder(options, parentId, folderName) {
    let response = await fetchApi('files', 'POST', true, {
        parentId,
        name: folderName,
        type: 'dir'
    }, true, false)

    if (response.ok) {
        return response
    }
}


function getResourceName(apiOptions, resource) {
    return resource.name
}

async function renameResource(options, id, newName) {
    let response = await fetchApi(`files/${id}`, 'PUT', true, {
        name: newName
    }, true, false)

    if (response.ok) {
        return response
    }
}

async function removeResources(options, resource) {
    resource.map(async (r) => {
        await fetchApi(`files/${r.id}`, 'DELETE', true)
    })
}

export default {
    init,
    hasSignedIn,
    getIdForPath,
    getResourceById,
    getCapabilitiesForResource,
    getChildrenForId,
    getParentsForId,
    getParentIdForResource,
    getResourceName,
    createFolder,
    downloadResources,
    renameResource,
    uploadFileToId,
    removeResources
}