import hmacSHA256 from 'crypto-js/hmac-sha256'
import cookie from "react-cookies";

async function fetchApi(path, method, header = true, body = undefined, body_stringify = true, jsonify = true, responseType = 'json'){
    let opts

    if (method !== "GET") {
        if (!header) {
            opts = {
                method,
                body: body_stringify ? JSON.stringify(body) : body,
                responseType
            }
        } else {
            opts = {
                method,
                body: body_stringify ? JSON.stringify(body) : body,
                headers: {
                    'X-CREA-KEY': hmacSHA256('/' + path, window.$sha).toString() + ':' + window.$user
                },
                responseType
            }
        }
    } else {
        if (header) {
            opts = {
                method,
                headers: {
                    'X-CREA-KEY': hmacSHA256('/' + path, window.$sha).toString() + ':' + window.$user
                },
                responseType
            }
        } else {
            opts = {
                method,
                responseType
            }
        }
    }

    if (header) {
        opts['headers'] = {
                'X-CREA-KEY': header ? hmacSHA256('/' + path, window.$sha).toString() + ':' + window.$user : ''
        }
    }


    let response = await fetch(window.$url + path, opts)


    if (response.ok){
        if (jsonify)
            return await response.json()
        else
            return response;
    } else {
        if (response.status === 403) {
            await cookie.remove('SSID', {
                path: '/'
            })
            sessionStorage.setItem('last_path', window.location.pathname)
            window.location.href = '/connection'
        }
        console.log(response.status, response.statusText)
        return false
    }

}

export {
    fetchApi
}