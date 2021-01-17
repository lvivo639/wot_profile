import cron from 'node-cron'
import ProfileModel from '../models/profileModel.js'
import { getInfo } from './wotApi.js'

const runProfileUpdated = () => {
    cron.schedule('* * * * *', async function () {
        const profileList = await ProfileModel.find()
        for(const profile of profileList){
            const { achievements, frags, max_series } = await getInfo(profile.account_id)
            profile.achievements = achievements
            profile.frags = frags
            profile.max_series = max_series
            await profile.save()
        }
    })
}

export default runProfileUpdated