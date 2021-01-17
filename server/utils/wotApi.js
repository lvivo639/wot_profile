import axios from 'axios'
import querystring from 'querystring'

const requestUrl = (path, queryParams) => {
    return 'https://api.worldoftanks.ru/wot/account/' + path + '/?' + querystring.stringify(queryParams)
}

const getList = async (username) => {
    const queryParams = {
        application_id: process.env.WOT_APP_ID,
        search: username
    }

    const result = await axios.get(requestUrl('list', queryParams))
    return result.data.data
}

const getInfo = async (account_id) => {
    const queryParams = {
        application_id: process.env.WOT_APP_ID,
        account_id: account_id
    }

    const result = await axios.get(requestUrl('achievements', queryParams))
    if(result.data.error){
        throw new Error(result.data.error.message)
    }
    const profileData = result.data.data[account_id.toString()]
    if(!profileData) throw new Error('Accound_id is invalid')
    return profileData
}

export { getList, getInfo }