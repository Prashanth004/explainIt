import config from '../../../../config/config'
export const registerCallToBrowser = ()=>{
    localStorage.setItem('currentAction',JSON.stringify(config.FULL_SCREEN_SHARE))
}

export const registerRecordToBrowser = ()=>{
    localStorage.setItem('currentAction',JSON.stringify(config.FULL_SCREEN_RECORD))
}

export const registerEndToBrowser = ()=>{
    localStorage.setItem('currentAction', JSON.stringify(null))
}