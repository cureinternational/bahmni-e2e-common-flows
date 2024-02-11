const logHelper = require('./logHelper');

function save(key,value){
    gauge.dataStore.scenarioStore.put(key,value);
    print(key,value);
}

function get(key){
    return gauge.dataStore.scenarioStore.get(key);
}

function print(key,value){
    if(process.env.DEBUG==='true')
    {
    if(typeof value=='object')
    {
    var jsonvalue=JSON.stringify(value)
    gauge.message(`${key} ${jsonvalue}`)
    }
    else
    {
    console.log(`${key} =====>>>>> ${value}`)
    gauge.message(`${key} ${value}`)
    }
    }
}

function takeScreenshot(){
    gauge.screenshot();
}

module.exports = {
    save: save,
    get: get,
    print: print,
    takeScreenshot:takeScreenshot
}