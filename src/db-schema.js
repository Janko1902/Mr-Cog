const { Sequelize, DataTypes } = require('sequelize');

// https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor
const sequelize = new Sequelize(
    'mr_cog', //database name
    'username', //username
    null, //password
    {
        host: process.env.DATABASE_HOST,
        dialect: 'mariadb'
    }
)

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
      unique: true,
    },
    mcName: {
      type: DataTypes.STRING,
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
await User.sync(); // ensures record is in your database

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true