"use strict";

/* Package System */
const fs = require('fs');
const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const {parse} = require('url');

/* Package Application */
const app = express();
const nextApp = next({dev:!(process.env.NODE_ENV=='production'||process.env.NODE_ENV=='staging')});
const handle = nextApp.getRequestHandler();

try{
	let server;
	let env = process.env.NODE_ENV??'local';

	nextApp.prepare().then(()=>{
		app.disable('x-powered-by');
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({extended:true}));
		app.use(cors());
		if(process.env.NODE_ENV=='production'||process.env.NODE_ENV=='staging') app.use(helmet({contentSecurityPolicy:false,crossOriginEmbedderPolicy:false}));
		app.put('/cookie',(req,res)=>{
			if(req.body.sg!=''&&req.body.email!=''){
				let _maxAge = req.body.expires-Date.now();
				let _options = {
					path:'/',
					maxAge:_maxAge,
					httpOnly:true,
					sameSite:'Strict',
					secure:(process.env.NODE_ENV==='production'||process.env.NODE_ENV==='staging')?true:false
				};
				return res.cookie("_sg",req.body.sg,_options).status(200).end();
			}else res.status(200).end();
		});
		app.delete('/cookie',(req,res)=>{
			return res.clearCookie("_sg",{path:'/'}).status(200).end();
		});
		app.get('*',(req,res)=>{
			return handle(req,res,parse(req.url,true))
		});

		server = require('http').createServer(app);
		server.listen(process.env.PORT);
		console.log(`CMS | ${env} - ${process.pid} is running on port ${process.env.PORT}`);
	}).catch(ex=>{
		console.error(ex.stack);
		process.exit(1);
	});
}catch(e){console.log(e)}