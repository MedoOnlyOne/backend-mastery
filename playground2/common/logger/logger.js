class Logger{
    constructor(){
        if(!Logger.instance){
            Logger.instance = this;
        }
        return Logger.instance;
    }
    log(level, message, metaData={}){
        const logObject = {
            level: level,
            message: message,
            timestamp: Date.now(),
            ...metaData
        };
        console.log(JSON.stringify(logObject));
    }
    info(message, metaData={}){
        this.log('info', message, metaData);
    }
    error(message, metaData={}){
        this.log('error', message, metaData);
    }
    warn(message, metaData={}){
        this.log('warn', message, metaData);
    }
    debug(message, metaData={}){
        this.log('debug', message, metaData);
    }
}

const logger = new Logger();
module.exports = logger;