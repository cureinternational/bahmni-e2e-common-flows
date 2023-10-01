

function info(key,message) {
    if(process.env.DEBUG==='true') 
    {
        if(typeof key=='object')
        {
            var errorJson=JSON.stringify(key)
            console.info(errorJson,message)
            gauge.message(`${errorJson} ${message}`)
        }
        else
        {
            console.info(key,message)
        }
    }
}

function error(key,message) {
    if(process.env.DEBUG==='true') 
    {
        if(typeof key=='object')
        {
            var errorJson=JSON.stringify(key)
            console.error(errorJson,message)
            gauge.message(`${errorJson} ${message}`)
        }
        else
        {
            console.error(key,message)
            gauge.message(`${key} ${message}`)
        }
    }
}

module.exports = {
    info: info,
    error: error
}