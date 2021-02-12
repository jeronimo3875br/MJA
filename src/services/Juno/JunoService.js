"use strict";

const axios = require("axios");

const pkg = require("../../../package.json");

const { setCache, getCache } = require("../../services/Redis/RedisService");

module.exports = class JunoServiceAPI {
    constructor(sandbox, accessToken, resourceToken){

        this.api = axios.create({
            baseURL: sandbox
                ? 'https://sandbox.boletobancario.com/api-integration'
                : 'https://api.juno.com.br',
        });
        
        this.headers = {
            'User-Agent': `${pkg.name}/${pkg.version}`,
            'X-Api-Version': 2,
            'X-Resource-Token': resourceToken,
            Authorization: `Bearer ${accessToken}`
        };

        this.baseURL = sandbox ? `${process.env.URL_JUNO_SANDBOX}/api-integration` : process.env.URL_JUNO_PRODUCTION;
    }

    listBanks(){
        return new Promise(async (resolve, reject) => {
            try {

                const checkRedisCache = await getCache("JUNO_BANKS");

                if (!checkRedisCache){

                    const { data, status } = await this.api.get("/data/banks", { headers: this.headers });

                    if (status !== 200) reject("Ops! We had a problem listing the banks, review the data and / or try again :(");

                    await setCache("JUNO_BANKS", JSON.stringify(data._embedded.banks), 2678400);
                    resolve(data._embedded.banks);

                }else{
                    resolve(JSON.parse(checkRedisCache));
                };

            }catch(error){
                reject(error);
            };
        });
    }

    createCharge(charge, billing){
        return new Promise(async (resolve, reject) => {
            try {

                const body = { charge, billing };

                const { data, status } = await this.api.post("/charges", body, { headers: this.headers });

                if (status !== 200 || !data._embedded.charges.length) reject("Ops! It was not possible to register the boleto, given the data and / or try again :(");

                resolve(data._embedded.charges);

            }catch(error){
                reject(error);
            };
        });
    }

    listCharge(id){
        return new Promise(async (resolve, reject) => {
            try {

                const checkRedisCache = await getCache(`JUNO_CHARGE_${id}`);

                if (!checkRedisCache){

                    const { data, status } = await this.api.get(`/charges/${id}`, { headers: this.headers });

                    if (status !== 200 || !data.amount) reject("Ops! We were unable to list this charge, check the data and / or try again :(");
                    
                    await setCache(`JUNO_CHARGES_${id}`, JSON.stringify(data), 604800);
                    resolve(data);
                
                }else{
                    resolve(checkRedisCache);
                };

            }catch(error){
                reject(error);
            };
        });
    }

    cancelCharge(id){
        return new Promise(async (resolve, reject) => {
            try {

                const { data, status } = this.api.put(`/charges/${id}/cancelation`, null, { headers: this.headers });

                resolve();

            }catch(error){
                reject(error);
            };
        });
    }

    listCharges(){
        return new Promise(async (resolve, reject) => {
            try {

                const { data, status } = await this.api.get("/charges", { headers: this.headers });

                if (status !== 200) reject("Ops! It was not possible to list the charge, check the data and / or try again :(");

                resolve(data._embedded.charges);

            }catch(error){
                reject(error);
            };
        });
    }
};