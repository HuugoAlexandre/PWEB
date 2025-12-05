const { DataTypes } = require('sequelize');

function defineContactModel(sequelize) {
  const ContactModel = sequelize.define(
    'Contact',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      idade: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      genero: {
        type: DataTypes.STRING(40),
        allowNull: true
      },
      interesses: {
        // armazenado como STRING: "node,express,ejs"
        type: DataTypes.STRING,
        allowNull: true
      },
      mensagem: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      aceite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      tableName: 'contact',
      timestamps: true, // cria createdAt, updatedAt
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    }
  );

  return ContactModel;
}

module.exports = { defineContactModel };
