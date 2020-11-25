# API República Free Surf

## URL

https://republica-free-surf.herokuapp.com/

## Configurações

### Banco de dados

MongoDB - versão 3.4.7

URIs de conexão:  
Ambiente de testes: `mongodb+srv://heroku_qd9p98fv:<SENHA>@cluster-qd9p98fv.y1p4j.mongodb.net/heroku_qd9p98fv?retryWrites=true&w=majority`  
Ambiente de produção: `mongodb+srv://heroku_0j8dhfcs:<SENHA>@cluster-0j8dhfcs.q2khv.mongodb.net/heroku_0j8dhfcs?retryWrites=true&w=majority`

### Interface de administração do servidor

https://dashboard.heroku.com/apps/republica-free-surf

## Desenvolvimento

Se ainda não tiver, crie um arquivo chamado .env com as seguintes chaves:  
`AWS_ACCESS_KEY_ID = ...`  
`AWS_SECRET_ACCESS_KEY = ...`  
`FACEBOOK_APP_ID = ...`  
`FACEBOOK_APP_SECRET = ...`  
`JWT_SECRET = ...`  
`NODE_ENV = ...`  
`S3_BUCKET = ...`  
`S3_REGION = ...`  
`MONGODB_URI = ...`  
O arquivo .env não é versionado porque contêm informação sigilosa e estamos versionando o código num repositório de acesso público.

Para rodar localmente execute `sudo npm start`.
O serviço rodará na URL `https://localhost:444`.

## Deploy

Na pasta raiz, após fazer todos o commits, executar o comando abaixo para fazer o deploy no heroku via git

`git push heroku master`
