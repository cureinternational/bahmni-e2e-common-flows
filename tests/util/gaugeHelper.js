function save(key,value){
    gauge.dataStore.scenarioStore.put(key,value);
    if(process.env.DEBUG==='true') 
    {
        console.log(`${key} ===> ${value}`)
        print(key,value);
    }

}

function get(key){
    return gauge.dataStore.scenarioStore.get(key);
}

function print(key,value){
    gauge.message(`${key} ${value}`)
}

module.exports = {
    save: save,
    get: get,
    print: print
}