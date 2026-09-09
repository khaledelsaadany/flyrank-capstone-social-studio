const express=require('express');
const path=require('path');
const {getDatabase}=require('./db/connection');
const {postsRepo,variantsRepo,slotsRepo,historyRepo}=require('./db');
function createApp(customDb=null){const app=express();const db=customDb||getDatabase();app.use(express.json());app.use(express.urlencoded({extended:true}));app.use(express.static(path.join(__dirname,'../public')));app.get('/api/health',(req,res)=>res.json({success:true,status:'ok'}));app.get('/api/posts',(req,res)=>{const posts=postsRepo.findAll(db);res.json({success:true,count:posts.length,posts});});return app;}
module.exports={createApp};
