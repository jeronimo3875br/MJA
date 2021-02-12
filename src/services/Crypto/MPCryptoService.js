"use strict";

module.exports = {

    retira_acentos(str) {
        const com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ ";
        const sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr ";

        let resposta = "";

        for (i = 0; i < str.length; i++){
            troca = false;
            for (a = 0; a < com_acento.length; a++) {
                if (str.substr(i, 1) == com_acento.substr(a, 1)) {
                    novastr += sem_acento.substr(a, 1);
                    troca = true;
                    break;
                };
            };

            if (troca == false) {
                novastr += str.substr(i, 1);
            };
        };

        return novastr;
    },

    reverse(str){
        const splitString = str.split("");
        const reverseArray = splitString.reverse();
        const joinArray = reverseArray.join("");

        return joinArray;
    },

    ord(texto){
        return texto.charCodeAt(0);
    },

    chr(texto){
        return String.fromCharCode(texto);
    },

    codif(senha){
        let resposta = "";

        for (let i = 0; i < senha.length; i++) {
          resposta += this.chr(this.ord(senha.substr(i, 1)) - 20);
        };

        return this.reverse(resposta);
    },
    
    decodif(senha){
        let resposta = "";

        for (let i = 0; i < senha.length; i++) {
            resposta += this.chr(this.ord( senha.substr(i, 1) ) + 20)
        };

        return this.reverse(resposta)
    }
    
};