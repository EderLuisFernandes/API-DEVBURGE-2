## vAMOS Para API parte 2 usando o JWT - JSON WEB TOKEN
# REQUISIÇAÕ E RESPONSTA 
 - ONDE PASSAMSO PAR ADEIXAR NOSSA APLICAÇÃO MAIS SEGURA.. DEIXA NOS LOGADO PARA SEMPRE OU COM UM TEMPO DETERMINADAO...
[X] REQUISITO ELE MOSTRA O ID EMAIL E O TOKEN...
[X] HEADER - PRIMEIRA PARTE DO JWT
[X] PAYLOAD -  2 PARTE DO JWT 
[X] HASH DO USUARIO DERALMENTE O 1 E 2 SAO PADROES E O 3 SEMPRE VEM DIFERENTE...
# CONFIGURANDO O JWT VAMOS INSTALAR
[X] yarn add jsonwebtoken - ele nos auxilia a gerar o *JWT*
[x] DEPOIS VOU NO CONTROLLER SESSION E ADICIONO O JWT IMPORTANDO ELE E FAZENDO UM MUDANÇA NO CODIGO
 token: jwt.sign({id: user.id},'e0a4fd6d8376fa4ed6652f3de9c64cfa',{
                expiresIn: '5d'
            })
 - SENDO QUE  VAI PUXAR O ID DEPOIS VAI ADICIONAR UM CARACTERES QUE FOI COCLOCADO COM MD5HASH, E NO FINAL DIGO QUANTOS DIAS ELE PODE FICAR LOGADO CASO ELE NÃO DESLOQUE SOZINHO..

 [x] vamos criar um auth.js no config para deixa a chave e o dias separado so por organizaaçãoar
 export default { 
    secret: 'e0a4fd6d8376fa4ed6652f3de9c64cfa',
    expiresIn: '5d'
}
[x] e no seesion do controleer vamos fazer isso aqui ↓
token: jwt.sign({id: user.id},auth.secret,{
                expiresIn: auth.expiresIn
            })
        
## PADRONIZANDO MEU TOKEN USANOD O BEARER + TOKEN GEREADO
 - [X] VAMOS NO HTTPI NO GET HEADEAR E VAMOS ADICIONAR O AUTORIZATION
 - [X] VAMOS USAR OS MEDDLEWARE ELE VEM ANTES DOS CONTROLLER EX:↓
   REQUEST -> MEDDLEWARE -> CONTROLLER -> MODEL -> DATABASE -> RESPONSE
   - [X] ENTAO ANTES DE O CONTROLLER EXECULTA ELE VERIFICAR SE O TOKEN É VALIDO..

   VAMOS CRIAR UM ARQUIVO MIDDLEWARE COM AUTH.JS... CRIANDO UMA FUNÇÃO COM REQUEST, RESPONSE, E  NEXT SE NÃO ADIIONAR O NEXT A APLICAÇLÃO NÃO VAI PARA FRENTE.......
   function authMiddleware(request, response, next){
 const authToken = request.headers.authorization;
 if(!authToken){
    return response.status(401).json({error:'token não providenciado'})
 }

const token = authToken.split(' ').at(1)

 next();
}

export default authMiddleware;
  - essse é nosso codigo o token ele ta sendo usando para so msotrar minha autenticação enão precisa mostrar o BEARER por isso que o split esta vazio e o at e pra dizer que aparte d0 1 array voce mostra depois de algumas atualização nosso codigo ficou desse jeito ↓
  import jwt from 'jsonwebtoken'
import auth from '../config/auth';

function authMiddleware(request, response, next){
 const authToken = request.headers.authorization;
 if(!authToken){
    return response.status(401).json({error:'token não providenciado'})
 }

const token = authToken.split(' ').at(1)
try{
    jwt.verify(token ,auth.secret, (err ,decoded)=>{
        if(err){
            throw new Error()
        }

        request.userId = decoded.indexOf;

       
    })
}
catch(err){
    return response.status(401).json({error: 'Token é invalido'})
}

return next();
 
}

export default authMiddleware;
# VAMOS NA ROTA AUTENTICAR TODAS AS ROTAS ADICIONAMOS UM CODIGO EMCIMA E TODOS QUE TIVER ABAIXO VAI SER AUTENTICAD...
 - [x] routes.use(authMiddleware);