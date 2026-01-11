import {User, Server, WhitelistApplication, Infraction, Punishment} from './db-schema.js';

export async function createUser(name, discordID, birthdate, email) {
    const newbie = User.build({
        name: name,
        discordID: discordID,
        birthdate: birthdate,
        email: email
    });
    await newbie.save();
    console.log("Created new user '" + name + "' with id: "+newbie.get('id'));
    return newbie;
}