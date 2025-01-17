const db = require("../models");
const bcrypt = require("bcryptjs");
const {
    validationResult
} = require("express-validator");
const {
    v4: uuidv4
} = require('uuid');


const upload = require('../utils/multer')
const s3 = require('../utils/s3')


const userController = {
    signup: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        } else {
            db.User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(possibleUser => {
                if (possibleUser) {
                    res.json('User already exists');
                } else {
                    db.User.create({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, 10),
                    }).then((user) => {
                        let response = {
                            message: 'Account created successfully',
                            data: {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                            }
                        };
                        res.json(response);
                    });
                }
            })
        }
    },
    login: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        } else {
            db.User.findOne({
                where: {
                    email: req.body.email,
                }
            }).then((user) => {

                if (user != undefined) {
                    if (bcrypt.compareSync(req.body.password, user.password)) {
                        console.log('User Authenticated')

                        let response = {
                            user
                        }
                        res.json(response)
                    } else {
                        res.json('The password is incorrect')
                    }

                } else {
                    res.json('User not found')
                }
            }).catch(() => {
                let error = {
                    ok: false
                }
                res.json(error)
            })
        }
    },
    awsImageUploader: (req, res) => {

        let myFile = req.file.originalname.split(".")
        const fileType = myFile[myFile.length - 1]

        console.log('myFile', myFile)
        console.log('fileType', fileType)

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${uuidv4()}.${fileType}`,
            Body: req.file.buffer,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentDisposition: 'inline',
            ContentType: 'image/jpeg', //<-- this is what you need!
        }

        //Validación de si el usuario es adminsitrador, si lo es ejecuta el codigo de abajo
        console.log('params', params)
        s3.upload(params, (error, data) => {
            
            if (error) {
                res.status(500).send(error)
            }

            let response = {
                location: 'https://s3.console.aws.amazon.com/s3/buckets/ong-bucket-alkemy?region=us-east-1&tab=objects',
                image: `https://${params.Bucket}.s3.amazonaws.com/${data.Key}`,
                bucket: data.Bucket,
            }

            res.json(response)

        })

    }
};

module.exports = userController;