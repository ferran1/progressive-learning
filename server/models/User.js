const {DataTypes, Model} = require('sequelize');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class User extends Model {

    generateJWToken() {
        const expirationTime = process.env.JWT_EXPIRATION;
        return jwt.sign({
            id: this.id,
            username: this.username,
            admin: this.admin
        }, process.env.JWT_SECRET, {expiresIn: expirationTime});
    }

    static hashPassword(password) {
        const salt = crypto.randomBytes(128).toString('base64');
        const iterations = 10000;
        const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512');
        return {
            salt: salt,
            hash: hash
        };
    }
}

module.exports = User.init({
    first_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            min: 8
        }
    },
    password_salt: {
        type: DataTypes.STRING,
        unique: true
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    about_me: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_picture: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
        get() {
            if(this.getDataValue('profile_picture') != null)
                return this.getDataValue('profile_picture').toString('utf8');
            else
                return 'https://i.imgur.com/HAr1TAL.png';
        }
    }
}, {
    sequelize,
    modelName: 'user'
});
