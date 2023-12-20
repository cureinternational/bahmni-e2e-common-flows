

function info(key,message) {
    if(process.env.DEBUG==='true') 
    {
        if(typeof key=='object')
        {
            var errorJson=JSON.stringify(key)
            gauge.message(`${errorJson} ${message}`)
        }
        else
        {
            if(message!=undefined)
            console.info(key,message)
            gauge.message(`${key} ${message}`)
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
            if(message!=undefined)
            {
            console.error(key,message)
            gauge.message(`${key} ${message}`)
            }
        }
    }
}

module.exports = {
    info: info,
    error: error
}