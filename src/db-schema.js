const {Sequelize, DataTypes, Model} = require('sequelize');

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

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection established');
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConnection();

async function runSync(table) {
    try {
        await table.sync();
        console.log('Table Synced');
    } catch (err) {
        console.error('Sync failed:', err);
    }
}

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
const User = sequelize.define(
    'User',
    {
        // Model attributes are defined here
        name: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // allowNull defaults to true
        },
        age: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        discordId: {
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
        timestamps: true,
        createdAt: 'registeredAt',
        freezeTableName: true,
    },
);

runSync(User);

// `sequelize.define` also returns the model
console.log(User === sequelize.authenticate()); // true