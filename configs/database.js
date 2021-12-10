const mongoose = require('mongoose');
const userModel = require('../models/user.model');
mongoose
    .connect(`mongodb://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@127.0.0.1:27017/${process.env.DB_NAME}?&authSource=admin`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
    .then( async () => {
        console.log('Connected to mongoDB');
        const data = {
            "firstName": "Ernest",
            "lastName": "KOUASSI",
            "username": "mrke",
            "email": "ernest.kouassi@veone.net",
            "password": "Mrke@2021",
            "roles": ["ROLE_ADMIN"],
            "enabled": true
        };

        const uniqUser = await userModel.findOne({ username: data.username }).exec();
        if(null !== uniqUser){
            return;
        }
        await userModel.create(data);
        console.log('Admin created succefully');
    })
    .catch(error => console.log('Failed to connect to mongoDB', error))