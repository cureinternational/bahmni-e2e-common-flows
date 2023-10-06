const logHelper = require('./logHelper');

function save(key,value){
    gauge.dataStore.scenarioStore.put(key,value);
    if(process.env.DEBUG==='true') 
    {
        print(key,value);
    }

}

function get(key){
    return gauge.dataStore.scenarioStore.get(key);
}

function print(key,value){
    if(typeof value=='object')
    {
    var jsonvalue=JSON.stringify(value)
    gauge.message(`${key} ${jsonvalue}`)
    }
    else
    {
    gauge.message(`${key} ${value}`)
    }
}

module.exports = {
    save: save,
    get: get,
    print: print
}