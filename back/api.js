const { MongoClient, ServerApiVersion } = require('mongodb');

class Api {
    constructor (uri) {
        this.client = new MongoClient(uri, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
          });
    }

    async getUser ({login, password}) {
        await this.client.connect();
        const result = await this.client.db("users").collection("users")
        .findOne({ login });
        await this.client.close()
        if (result) {
            if (result.password === password){
                return true
            }
            return false
        } else {
            return false
        }
        
    }

    async checkLoginFreeness ({login, password}) {
        await this.client.connect();
        const result = await this.client.db("users").collection("users").findOne({ login });
        await this.client.close()
        if (result) {
            return false
        }
        return true
    }

    async createUser (data) {
        try{
            await this.client.connect();
            const result = await this.client.db("users").collection("users").insertOne(data);
            console.log(`New listing created with the following id: ${result.insertedId}`);
            await this.client.close()
            return true
        } catch (e) {
            console.log(e);
            return false
        }
        
    }

    static validateUser (login, password) {
        const validation = {status: true, reason: []}
        if (login.length <2 || password.length <3){
            validation.status = false
            validation.reason.push("Слишком короткий логин или пароль")
        } 
        if (login == password) {
            validation.status = false
            validation.reason.push("Логин и пароль не должны совпадать")
        }
        if (login.length > 20 || password.length > 32){
            validation.status = false
            validation.reason.push("Слишком длинный логин или пароль")
        }
        return validation
    }
}

module.exports = Api


