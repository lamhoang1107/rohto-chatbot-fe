"use strict";

/* Package System */
require('dotenv').config();
const path = require('path');
const environment = {
	BASE_URL:process.env.BASE_URL,
	API_URL:process.env.API_URL,
	PREFIX_API:process.env.PREFIX_API,
};

module.exports = {
	distDir:'_next',
	poweredByHeader:false,
	env:{...environment},
	images: {
		domains: [],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	sassOptions:{includePaths:[path.join(__dirname,'node_modules'),path.join(__dirname,'public/scss')]},
	webpack:(config,{buildId,dev,isServer,defaultLoaders,webpack})=>{

		config.resolve.alias['@public'] = path.join(__dirname,'public');
		config.resolve.alias['@config'] = path.join(__dirname,'src/config');
		config.resolve.alias['@features'] = path.join(__dirname,'src/features');
		config.resolve.alias['@libs'] = path.join(__dirname,'src/libs');
		config.resolve.alias['@modules'] = path.join(__dirname,'src/modules');
		config.resolve.alias['@views'] = path.join(__dirname,'src/views');
		config.resolve.alias['@utils'] = path.join(__dirname,'src/utils');
		config.resolve.alias['@themes'] = path.join(__dirname,'src/themes');
		config.resolve.alias['@components'] = path.join(__dirname,'components');
		return config;
	},
	async rewrites(){
		return [
			{
				source:'/',
				destination:'/login'
			}
		]
	},
	eslint:{
		dirs:['pages','src']
	}
}
