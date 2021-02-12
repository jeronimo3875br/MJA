"use strict";

module.exports = class TimestampService {
    static getAll(){
        return new Date();
    }

    static getDateTime(){
        const time = new Date();
        return `${time.getDay()}:${time.getMonth()}:${time.getFullYear()} - ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

    }

    static getTime(){
        const time = new Date();
        return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

    }

    static getDate(){
        const time = new Date();
        return `${time.getDay()}:${time.getMonth()}:${time.getFullYear()}`;
    }

    static milliseconds(value){
        return new Date.parse(value);
    }
};