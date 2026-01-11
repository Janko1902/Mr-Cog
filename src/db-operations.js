import {User, Server, WhitelistApplication, Infraction, Punishment, initializeDatabase} from './db-schema.js';


export async function createUser(name, discordID, birthdate, email) {

    const newbie = User.build({
        name: name,
        discordID: discordID,
        birthdate: birthdate,
        email: email
    });
    await newbie.save();
    console.log("Created new user '" + name + "' with id: " + newbie.get('id'));
    return newbie;
}

await initializeDatabase();

createUser("TestUser", "`1234567890`", "2000-01-01", "test@eg.com");
//running twice will cause UNIQUE constraint error on discordID and email