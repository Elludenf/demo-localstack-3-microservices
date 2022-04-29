const { faker } = require('@faker-js/faker');

const User = require('./user')

const generateUsers = function(){
    const users = []

    for (let index = 0; index < 100; index++) {
    
        const element = new User()
        element.id = index
        element.name = faker.name.findName()
        element.email = faker.internet.email()
    
        users.push(element)
    }
    
    return users    
}

module.exports = {
    generateUsers
}