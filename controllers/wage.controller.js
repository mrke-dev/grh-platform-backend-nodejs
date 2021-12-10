const wageModel = require('../models/wage.model');
const {validate} = require("../utils/validators");
const objectID = require('mongoose').Types.ObjectId;

module.exports.list = async (req, res) => {
   await wageModel.find((error, docs) => {
       if (error) return res.status(400).send(error);
       return res.status(200).send(docs);
   })
}

module.exports.create = async (req, res) => {
    const { amount, employee } = req.body;

    try {
        const wage = await wageModel.create({ amount, employee })
        return res.status(201).send(wage);
    } catch (error){
        const errors = validate(error);
        return res.status(422).send(errors);
    }
}

module.exports.read = async (req, res) => {
    if (false === objectID.isValid(req.params.id))
        return res.status(400).send('UNKNOWN ID : ' + req.params.id)
    await wageModel.findById(
        { _id: req.params.id },
        (error, doc) =>{
            if (error) return res.status(400).send(error);
            return res.status(200).send(doc);
        }
    )
}

module.exports.update = async (req, res) => {
    if (false === objectID.isValid(req.params.id))
        return res.status(400).send('UNKNOWN ID : ' + req.params.id)

    const wageData = req.body;
    await wageModel.findByIdAndUpdate(
        {_id: req.params.id},
        {$set: { ...wageData }},
        { new: true, upsert: true, setDefaultsOnInsert: true },
        ((error, doc) =>{
            if (error) return res.status(200).send(validate(error))
            return res.status(200).send(doc);
        })
    )
}

module.exports.delete = async (req, res) => {
    if (false === objectID.isValid(req.params.id))
        return res.status(400).send('UNKNOWN ID : ' + req.params.id)

    try {
        await wageModel.findByIdAndDelete({ _id: req.params.id }).exec();
        return res.status(204).send({ message: 'Deleted successfully.' })
    } catch (error){
        res.status(400).send(error);
    }
}