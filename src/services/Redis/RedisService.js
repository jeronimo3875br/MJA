"use strict";

const redis = require("../../databases/redis/index");

module.exports = class RedisService {
    static setCache(key, value, time){
        return new Promise((resolve, reject) => {
            redis.setex(key, time, value, (error) => {
                if (error){
                    reject(error);
                }else{
                    resolve(true);
                };
            });
        });
    }

    static getCache(key){
        return new Promise((resolve, reject) => {
            redis.get(key, (error, value) => {
                if (error){
                    reject(error);
                }else{
                    resolve(value);
                };
            });
        });
    }
};