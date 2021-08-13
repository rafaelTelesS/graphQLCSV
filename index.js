const { request, gql } = require("graphql-request");  //require do graphql-request comandos que utilizei npm add graphql-request graphql e npm install graphql e npm install graphql-request  
var replaceall = require("replaceall");  //require do replace all para dar o replace explusivamente no "[" que não funciona com replace normal
var fs = require("fs");  //require para gerar o arquivo csv na pasta raiz
//criando o querry para definir o que eu quero ler do 'https://api.spacex.land/graphql/' (graphql api)
const query = gql`  
{
  ships{
    name
    active
    missions {
      name
    }
  }
}
`
var csvResponse = [];  //criando o array vazio para poder dar o push posteriormente
request("https://api.spacex.land/graphql/", query).then(data => {  //solicitando/consultando para o https://api.spacex.land/graphql/ as informações que necessito especificadas no querry
    var stringResult = JSON.parse(JSON.stringify(data));  //string resultado e .parse para conseguir trabalhar posteriormente
    var arrayLenght = Object.keys(data.ships);  //retornando .keys um array de propriedades com numeros para eu conseguir pegar o tamanho do array de ships de forma responsiva

    for (var i = 0; i < arrayLenght.length; i++) {  //for para preencher meu array com apenas os navios ativos e suas respectivas missoes
        if (stringResult.ships[i].active == true) {  //tratando para selecionar navios apenas com missão ativa
            csvResponse.push(stringResult.ships[i].name + "," + JSON.stringify(stringResult.ships[i].missions) + "\n");  //montando um array para posteriormente monstar o csv primeiro o nome do navio ativo depois as missões que participou
        }
    }
    csvResponse = String(csvResponse);  //array para string,manipilar 
    csvResponse = ("Ship Name," + "All Missions" + "\n") + csvResponse;  //cabecalho para explicar que primeiro vem o nome do navio e depois as missoes
    csvResponse = replaceall("[", "", csvResponse);  //retirando os [] para deixar no padrao csv, substituindo por "" 
    csvResponse = csvResponse.replace(/]/g, "");  //retirando os [] para deixar no padrao csv, substituindo por "" 
    csvResponse = csvResponse.replace(/{/g, "");  //retirando os {} para deixar no padrao csv, substituindo por "" 
    csvResponse = csvResponse.replace(/}/g, "");  //retirando os {} para deixar no padrao csv, substituindo por ""   
    csvResponse = csvResponse.replace(/"/g, "");  //retirando as "" para deixar no padrao csv, substituindo por ""   
    csvResponse = csvResponse.replace(/'/g, "");  //retirando as '' para deixar no padrao csv, substituindo por ""   
    csvResponse = csvResponse.replace(/name:/g, "");  //retirando name: das missions para deixar no padrao csv, substituindo por "" 
    csvResponse = csvResponse.replace(/\n+,/g, "\n");  //retirando as virgulas do push somente no \n para deixar no padrao csv
    fs.writeFile("responseCSV.csv", csvResponse, function (erro) {  //mesmo nao havendo a necessidade de gerar um arquivo csv eu resolvi fazer 
        if (erro) {
            throw erro;
        }
        console.log("Success save file");  //arquivo salvo com sucesso
    });
    console.log(csvResponse);  //console log com meu resultado final ja formatado no padrao csv
});




