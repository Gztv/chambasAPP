const { request, response } = require("express");
const { default: mongoose } = require("mongoose");
const Free = require('../models/freelancer');
const User = require('../models/user');

const freePopularGet = async(req, res = response) =>{
    const {page, limit = 5, from = 0, stars = "5", category = null} = req.query; 

    let query = {rank : stars};
    if(category!= null){
        query.categories = category;
    }

    const [total, usuarios] = await Promise.all([
        Free.countDocuments(query),
        Free.find(query).skip(Number(from)).limit(Number(limit))
        .populate('categories', {usuario:0})
        .populate('usuario', {  _id: 1, name: 1, lastname: 1, img: 1})
    ]);

    res.json({
        route : `get: {{url}}/api/usuarios/free? limit = ${limit} && from = ${from} && stars = ${stars}`, 
        total,
        usuarios
    });

}
const freeGetID = async(req = request, res = response) => {
    const {id} = req.params;
    const freelancer = await Free.findById(id)
    .populate('categories', {usuario:0})
    .populate('usuario', {  _id: 1, name: 1, lastname: 1,img: 1});
    
    res.json({
        route: `get: {{url}}/api/usuarios/free:${id}`,
        freelancer
    });
}
const freeCatGet = async(req, res = response) =>{
    const {page, limit = 5, from = 0} = req.query; 

    const {id} = req.params;

    const _id = mongoose.Types.ObjectId(id);

    const query = {categories : _id};

    const [total, usuarios] = await Promise.all([
        Free.countDocuments(query),
        Free.find(query).skip(Number(from)).limit(Number(limit))
        .populate('categories', {usuario:0})
        .populate('usuario', {  _id: 1, name: 1, lastname: 1,img: 1})
    ]);

    res.json({
        route : `get: {{url}}/api/usuarios/free? limit = ${limit} && from = ${from} && category = ${id}`, 
        total,
        usuarios
    });

}

const freePost = async (req = request, res = response) => {

const {desc, exp, skills, social, categories, rank, usuario} = req.body;

    const freelancer = new Free({desc,exp,skills,social,categories,rank,usuario});
    const user = await User.findByIdAndUpdate(usuario, {role : "FREE_ROLE"});
    await user.save();
    await freelancer.save();

 res.json({
     route : 'post: {{url}}/api/usuarios/free',
     freelancer
 });
}

module.exports = {
    freePopularGet,
    freePost,
    freeCatGet,
    freeGetID
}