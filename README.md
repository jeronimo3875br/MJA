<h3 align="center"> MPlanJunoAPI </h3>

<p align="center">
  <img src="https://github.com/jeronimo3875br/MJA/blob/master/api.gif" height="300" width="500" />
</p>


## Sumário
- [Objetivo](#objetivo)
- [Como funciona?](#como-funciona)
- [Como executar?](#como-executar)
- [Headers](#headers)
- [Endpoits](#endpoits)
  - [Login](#login)
    - [Exemplo de Login](#exemplo-de-login)
    - [Exemplo de emissão de cobrança](#exemplo-de-emissão-de-cobrança)
  - [Cancelar cobrança](#cancelar-cobrança)
    - [Exemplo de cancelamento](#exemplo-de-cancelamento)
  - [Listar cobrança](#listar-cobrança)
    - [Exemplo de listagem de cobrança](#exemplo-de-listagem-de-cobrança)
  - [Listar todas as cobranças](#listar-todas-as-cobranças)
    - [Exemplo de listagem de cobranças](#exemplo-de-listagem-de-cobranças)

# Objetivo

MPlanJunoAPI é uma API REST, desenvolvida em JavaScript, com o objetivo de se integrar com o sistema da Juno, com base nos serviços da MPLan e efetuar cobranças. Você pode consultar mais sobre cobranças no sistema da Juno, em: <a href="https://dev.juno.com.br/api/v2#tag/Cobrancas">https://dev.juno.com.br/api/v2#tag/Cobrancas</a>



# Como funciona?

As funcionalidades da API são acessadas através das rotas, que chamamos de endpoints, atualmente existem 5 endpoints disponivéis, esses são:

  ```bash
  
    # Endpoint de login
    1 - [POST] - /api/user/login
    
    # Endpoint para emitir cobrança
    2 - [POST] - /api/juno/create/charge
    
    # Endpoint para listar cobrança
    3 - [GET] - /api/juno/list/charge/:id
    
    # Endpoint para listar todas as cobranças
    4 - [GET] - /api/juno/list/charges
    
    # Endpoint para cancelar cobrança
    5 - [PUT] - /api/juno/cancel/charge/:id
    
  ```
  
# Como executar?



* A API roda em NodeJS, uma runtime JavaScript que você pode baixar e instalar, em: <a href="https://nodejs.org/en/download/">https://nodejs.org/en/download/</a>

* A API necessita de uma tecnologia chamada Redis, que é um banco de dados NoSQL em memória que você pode baixar, em: <a href="https://redis.io/download">https://redis.io/download</a>

Após a instalação dos executaveis necesários, basta executar no terminal o servidor Redis (talvez seja necessário configurar as variáveis de ambient):

```bash
  # Executando o Redis
  $ redis-server
```

Agora dentro da pasta do projeto. Na primeira vez, você deve instalar todas as dependências necessárias, faça isso usando NPM ou YARN:

```bash
  # Usando NPM
  npm install

  # Usando YARN
  yarn install

```


# Headers

Com excessão e após gerar o token JWT na rota de login, todas as outras rotas exigem um header de autorização (Authorization) para se autenticar, contendo o token Bearer de acesso gerado.

Exemplo:

```JSON
  {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  }
```

Exemplo simulando dados:

```JSON
  {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDEiLCJpYXQiOjE2MTIzNTg0MTUsImV4cCI6MTYxMjM5NDQxNX0.eIBj-PWUjtOTWSoXdP8jvpH3Q8IWDCfEgbYSjV7CkiU"
  }
```

__Lembre-se de que Authorization necessita do Bearer antes do token em se.__

# Endpoits

## Login

```bash
  # Rota de Login
  [POST] /api/user/login
```

O primeiro endpoint é o de login, é nele que você consegue o token de acesso para se autenticar nas outras rotas. Esse endpoint do tipo POST recebe 2 valores, sendo eles, o nome de usuário e a senha de login, esses dados devem ser enviados no corpo da requisição, como objetos:

```YML
  # Nome de usuário
  username: String
    
  # Senha de login 
  password: String
```

O status de resposta caso seja bem sucedido deve ser 201, e retorna um JSON contendo o Token de acesso e outros dados:

```JSON
  {
    "status": 201,
    "timestamp": "xxxx-xx-xxxxx:xx:xx.xxxx",
    "user_data": {
      "id": "Código do usuário",
      "name": "Nome do usuário",
      "username": "Nome de usuário",
      "firstName": "Primeiro nome"
    },
    "security": {
      "user_login": true,
      "access_token": "Token JWT",
      "message": "Existing user and successfully authenticated :)"
    }
  }
```

  ### Exemplo de Login
  ```ts
  import axios from "axios"; // Biblioteca para trabalhar com requisições
  
  // endpoint, nesse caso estamos trabalhando no localhost
  const url = "http://localhost:8080/api/user/login";
  
  // Simulando dados de Login
  const body = {
    username: "Teste",
    password: "123456anrf2488547"
  };
  
  // Função anônima asyncrona para utilizar com o Axios
  (async () => {
  
    try {
    
      const userLogin = await axios.post(url, body);
      
      console.log("Logado com sucesso!");
      console.log(userLogin); // Imprimindo os dados de resposta após efetuar o login
      
    }catch(error){
      console.log("Falha ao efetuar oo Login :(");
    };
  
  })();
  
 ````

## Emitir cobrança

```bash
[POST] /api/juno/create/charge
```


Emitir cobranças na Juno, apartir da API é tão fácil quanto qualquer outra funcionalidade da aplicação, mas deve-se ficar atento, pois essa rota exige muitos dados que não podem ter erros, esses dados devem ser enviados no corpo da requisição, como objetos e são:

```yml 
  # Dados da cobrança
  charge: 
    description: String # Descrição da cobrança
    amount: Float # Valor das parcelas
    dueDate: String # Data de vencimento (OPCIONAL) (ano-mês-dia - xxxx-xx-xx)
    installments: Number # Numero de parcelas
    maxOverdueDays: Number # Máximo de dias que pode pagar após o prazo (OPCIONAL)
    fine: Number # Multa de pagamento após o vencimento [0..20] (OPCIONAL)
    interest: Number # Juros ao mês [0..20] (OPCIONAL)
    paymentTypes: Array<String> # Métodos de pagamento ["BOLETO", "CREDIT_CARD", "BOLETO_PIX"] (OPCIONAL)
  
  # Dados de quem será cobrado
  billing: 
    name: String # Nome 
    document: String # Documento CPF ou CNH 
    email: String # Email
    address: 
      street: String # Rua 
      number: String # Número
      complement: String # Complemento
      city: String # Cidade
      state: String # Estado (UF)
      postCode: String # Código postal (CEP)
    phone: String # Telefone (OPCIONAL)
    notify: Boolean # Receber ou não receber notificações da Juno (OPCIONAL)
```

Caso você obtenha sucesso na requisição, o status deve ser 201, e retorna um JSON, com algumas informações (A resposta pode variar de acordo com os dados passados):

```JSON
  {
    "status": 201,
    "timestamp": "xxxx-xx-xxxxx:xx:xx.xxxx",
    "chargeData": [
      {
        "id": "Id da cobrança",
        "code": "Código da cobrança",
        "reference": "Referências da cobrança",
        "dueDate": "Data de vencimento da cobrança",
        "checkoutUrl": "URL de confirmação de emição de cobrança",
        "amount": "Valor das parcelas",
        "status": "Status da cobrança, sendo ACTIVE que a cobrança está aberta (CANCELLED, MANUAL_RECONCILIATION, FAILED, PAID)",
        "_links": {
          "self": {
            "href": "URL da cobrança"
          }
        }
      }
    ]
  }
```

  ### Exemplo de emissão de cobrança
  
  Caso não tenha entendido, fique tranquilo, com o exemplo abaixo você com certeza ira entender. O exemplo está em Typescript, mas é bem auto explicativo:
  
  ```ts
    import axios from "axios"; // Biblioteca para trabalhar com requisição
    
    // endpoint, nesse caso estamos trabalhando no localhost
    const url = "https://localhost:8080/api/juno/create/charge";
    
    // Header obrigatório para efetuar a requisição, você pode consultar sobre la em cima, na opcão de Headers
    const header = {
      "Content-Type": "application/json",

      // Token de acesso gerado no endpoint de login
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDEiLCJpYXQiOjE2MTIzNTg0MTUsImV4cCI6MTYxMjM5NDQxNX0.eIBj-PWUjtOTWSoXdP8jvpH3Q8IWDCfEgbYSjV7CkiU" 
    };
    
    // Corpo da requisição, nesse caso todos os dados que enviaremos são falsos, são apenas para exemplo
    const body = {
      charge: {
        description: "Exemplo de emição de cobrança usando a MPLanJunoAPI",
        amount: 100.00,
        dueDate: "2021-04-05",
        installments: 4,
        maxOverdueDays: 5,
        fine: 10.00,
        interest: 5,
        paymentTypes: [
          "BOLETO"
        ]
      },
      billing: {
        name: "Steve Jobs",
        document: "300.276.037.05",
        email: "teste15@gmail.com",
        address: {
          street: "Rua São Fernandes",
          number: "299",
          complement: "Próximo ao super mercado GoodBom",
          city: "Campinas",
          state: "SP",
          postCode: "244403667",
        },
        phone: "12 998819845",
        notify: true,
      }
    };
    
    (async () => {
    
      try {
      
        const { data, status } = await axios.post(url, body, { headers: header });
        
        if (status !== 200) console.log("Ops! Não foi possivel emitir a cobrança :(");
        
        console.log("Cobrança e emitida com sucesso :)"); 
        console.log(data); // Imprimindo os dados de resposta após efetuar a emissão de uma cobrança
        
      }catch(error){
        console.log("Ops! A emição da cobrança falhou :(");
      };
    
    })();
  ```

## Cancelar cobrança

```bash
  [PUT] /api/juno/cancel/charge/:id
```

Muitas vezes é preciso cancelar uma cobrança por muitos motivos, com a MPLanJunoAPI, você pode cancelar uma cobrança de maneira simples e rápida, passando o id da cobrança no final da URL de cancelamento, como mostrado a cima.

 ```yml
  id: String
 ```
 
 O resultado caso seja bem sucedido é um status 204, sem nehuma resposta.
 
 ### Exemplo de cancelamento 
  
 ```ts
 
  import axios from "axios"; // Biblioteca para trabalhar com requisições
  
  // endpoint, nesse caso estamos trabalhando no localhost
  const url = "http://localhost:8080/api/juno/cancel/charge";
  
  // Esse é um ID de uma cobrança que estamos simulando, apenas para efeito de entendimento :)
  const id = "char_92350248524442";
  
  // Header obrigatório para efetuar a requisição, você pode consultar sobre la em cima, na opcão de Headers
  const header = {
    "Content-Type": "application/json",
    
    // Token de acesso gerado no endpoint de login
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDEiLCJpYXQiOjE2MTIzNTg0MTUsImV4cCI6MTYxMjM5NDQxNX0.eIBj-PWUjtOTWSoXdP8jvpH3Q8IWDCfEgbYSjV7CkiU" 
  };
  
  // Função anônima asyncrona para utilizar com o Axios
  (async () => {
  
    // Efetuando o cancelamento, ele não retorna nada, então vamos usar um Try/Catch para ver se tem algum erro
    try {
    
      const cancelCharge = await axios.put(`${url}/${id}`, null, { headers: header });
      console.log("Cancelamento efetuado com sucesso hehe ^^");
      
    }catch(error){
      console.log("Ops! O cancelamento falhou :(");
    };
  
  })();
  
 ```


## Listar cobrança

```bash
  [GET] /api/juno/list/charge/:id
```

Para listar uma cobrança basta passar o endpoint e no final da URL passar o id da cobrança, não confunda o ID com o Código da cobrança.

 ```yml
  id: String
 ```
 
 O resultado caso seja bem sucedido é um status 200 e retorna um JSON:
 
```JSON
  {
    "status": 201,
    "timestamp": "xxxx-xx-xxxxx:xx:xx.xxxx",
    "chargeData": [
      {
        "id": "Id da cobrança",
        "code": "Código da cobrança",
        "reference": "Referências da cobrança",
        "dueDate": "Data de vencimento da cobrança",
        "checkoutUrl": "URL de confirmação de emição de cobrança",
        "amount": "Valor das parcelas",
        "status": "Status da cobrança, sendo ACTIVE que a cobrança está aberta. (ACTIVE, CANCELLED, MANUAL_RECONCILIATION, FAILED, PAID)",
        "_links": {
          "self": {
            "href": "URL da cobrança"
          }
        }
      }
    ]
  }
```
 
 ### Exemplo de listagem de cobrança
  
 ```ts
 
  import axios from "axios"; // Biblioteca para trabalhar com requisições
  
  // Endpoint, nesse caso estamos trabalhando no localhost
  const url = "http://localhost:8080/api/juno/list/charge";
  
  // Esse é um ID de uma cobrança que estamos simulando, apenas para efeito de entendimento :)
  const id = "char_92350248524442";
  
  // Header obrigatório para efetuar a requisição, você pode consultar sobre la em cima, na opcão de Headers
  const header = {
    "Content-Type": "application/json",
    
    // Token de acesso gerado no endpoint de login
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDEiLCJpYXQiOjE2MTIzNTg0MTUsImV4cCI6MTYxMjM5NDQxNX0.eIBj-PWUjtOTWSoXdP8jvpH3Q8IWDCfEgbYSjV7CkiU" 
  };
  
  // Função anônima asyncrona para utilizar com o Axios
  (async () => {
  
    try {
    
      const { data, status } = await axios.get(`${url}/${id}`, null, { headers: header });
      console.log("Aqui está a sua cobrança :)");
      console.log(data); // Imprimindo os dados da cobrança que estamos querendo buscar 
      
    }catch(error){
      console.log("Ops! Não foi possivel listar essa cobrança :(");
    };
  
  })();
  
 ```


## Listar todas as cobranças

```bash
  [GET] /api/juno/list/charges
```

Para listar todas as cobranças, basta simplesmente passar o endpoint informado a cima.

 
 O resultado caso seja bem sucedido é um status 200 e retorna um JSON, contendo muitos registros de cobrança.
 
 ### Exemplo de listagem de cobranças
  
 ```ts
 
  import axios from "axios"; // Biblioteca para trabalhar com requisições
  
  // Endpoint, nesse caso estamos trabalhando no localhost
  const url = "http://localhost:8080/api/juno/list/charges";
  
  // Header obrigatório para efetuar a requisição, você pode consultar sobre la em cima, na opcão de Headers
  const header = {
    "Content-Type": "application/json",
    
    // Token de acesso gerado no endpoint de login
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDEiLCJpYXQiOjE2MTIzNTg0MTUsImV4cCI6MTYxMjM5NDQxNX0.eIBj-PWUjtOTWSoXdP8jvpH3Q8IWDCfEgbYSjV7CkiU" 
  };
  
  // Função anônima asyncrona para utilizar com o Axios
  (async () => {
  
    try {
    
      const { data, status } = await axios.get(`${url}/${id}`, null, { headers: header });
      console.log("Aqui está todas as cobranças :)");
      console.log(data); // Imprimindo os dados das cobranças que estamos querendo buscar 
      
    }catch(error){
      console.log("Ops! Houve algum problema ao buscar as cobranças :(");
    };
  
  })();
  
 ```
