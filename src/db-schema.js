import {DataTypes, Sequelize} from 'sequelize';

// https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor
/*const sequelize = new Sequelize(
    'mr_cog', //database name
    'username', //username
    null, //password
    {
        host: process.env.DATABASE_HOST,
        dialect: 'mariadb'
    }
)*/

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../database/database.db'
});


function normalizeBirthdate(value) {
    if (!value) return null;

    const d = new Date(value);
    d.setDate(1); // force day to 1

    return d.toISOString().slice(0, 10); // YYYY-MM-DD
}


//region tables

/*
By default, Sequelize automatically adds
the attributes createdAt and updatedAt to
every model, using the data type
DataTypes.DATE
Those attributes are automatically managed as well
*/
/*
Sequelize automatically adds an
auto-incremented integer attribute
called id as primary key
if none is specified.
*/
export const User = sequelize.define(
    'User',
    {
        // Model attributes are defined here
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            // allowNull defaults to true
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            set(value) {
                this.setDataValue('birthdate', normalizeBirthdate(value));
            },
        },
        discordID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        mcUuid: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        mcName: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }


    },
    {
        // Other model options go here
        timestamps: true,// enables createdAt and updatedAt
        createdAt: 'registeredAt',
        freezeTableName: true,
    },
);

export const WhitelistApplication = sequelize.define(
    'WhitelistApplication',
    {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        serverID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            set(value) {
                this.setDataValue('birthdate', normalizeBirthdate(value));
            },
        },
        applicationReason: {
            type: DataTypes.TEXT,
        },
        reviewedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending',
        },
        rejectReason: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'REQUIREMENTS NOT MET',
        },
        staffReviewerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
    },
);

export const Server = sequelize.define(
    'Server',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        panelID: {
            type: DataTypes.STRING(8),
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        modpackURL: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        modpackVersion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        minecraftVersion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        modLoader: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'fabric',
        },
        whitelistRequired: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        hidden: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
    },
);

export const Infraction = sequelize.define(
    'Infraction',
    {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        staffIssuerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        createdAt: 'dateIssued',
    },
);

export const Punishment = sequelize.define(
    'Punishment',
    {
        type: {
            type: DataTypes.ENUM('ban', 'timeout'),//todo potentially add more?
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        staffIssuerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        infractionID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        serverID: { //NULL for discord
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        endsAt: {
            type: DataTypes.DATE,
            allowNull: true, //null for permanent
        },
        revoked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        createdAt: 'dateIssued',
    },
);


//endregion


//region relations

User.belongsToMany(Server, {through: 'ServerPlayerWhitelist'});
Server.belongsToMany(User, {through: 'ServerPlayerWhitelist'});

WhitelistApplication.belongsTo(User, {foreignKey: 'userID', as: 'Applicant'});
User.hasMany(WhitelistApplication, {foreignKey: 'userID', as: 'Applications'});

WhitelistApplication.belongsTo(User, {foreignKey: 'staffReviewerID', as: 'Reviewer'});
User.hasMany(WhitelistApplication, {foreignKey: 'staffReviewerID', as: 'ReviewedApplications'});

WhitelistApplication.belongsTo(Server, {foreignKey: 'serverID'});
Server.hasMany(WhitelistApplication, {foreignKey: 'serverID'});

Infraction.belongsTo(User, {foreignKey: 'userID', as: 'Offender'});
User.hasMany(Infraction, {foreignKey: 'userID', as: 'Offenses'});


Punishment.belongsTo(Infraction, {foreignKey: 'infractionID'});
Infraction.hasMany(Punishment, {foreignKey: 'infractionID'});

Punishment.belongsTo(Server, {foreignKey: 'serverID'});
Server.hasMany(Punishment, {foreignKey: 'serverID'});

Infraction.belongsTo(User, {foreignKey: 'staffIssuerID', as: 'Issuer'});
User.hasMany(Infraction, {foreignKey: 'staffIssuerID', as: 'IssuedInfractions'});


//endregion


//region sync
// Syncing the models with the database


export async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection established');

        await sequelize.sync();
        console.log('Tables synced');
        console.log('Database Ready');

    } catch (err) {
        console.error('Connection failed:', err);
        return false;
    }

    return true;
}

//endregion

// `sequelize.define` also returns the model
console.log(User === sequelize.authenticate()); // true