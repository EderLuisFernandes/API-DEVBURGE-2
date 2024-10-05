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

 ### CRIANDO TABELAS DE CATEGORIA 
 - [x] yarn sequelize migration:create --name create-categories-table
 # DEPOIS DE CRIAR TUDO NO ORM VAMOS JOGA PRO BANCO 
 - [x] yarn sequelize db:migrate 
 AGORA VAMOS CRIAR A MODEL E O CONROLLER DA CATEGORIES DEPOIS DE ALTENTICADO E FEITO VAMO NO DATABASE QUE NÃO PODE FALTA PRA REGISTRAR UMA MODEL NOVA DEPOIS VAMO NA ROUTAS E COLOCA-MOS O QUE QUEREMOS VER...
  -[X] Para saber se a categoria ja exixte ou se vai criar uma nova e desetruturei pra não mostra dia e hora que foi criado....

  ### VAMOS CRIAR E EXLUIR CAMPO DE UMA TABELA A FOMASSA COLUNAS... PARATABELAS DE RELACIONAMENTOS 

  - [] VAMOS CRIA UM RELACIONAMENTO FK
  ###  NAS MIGRATION QUANDO ELAS SÃO CRIADAS ELA NÃO PODE SER MUDADA TODA VEZ QUE QUISER FAZER ALTERAÇÃO NO BANCO VAMOS CRIAR UMA NOVA....
  - [x] yarn sequelize migration:create --name remove-categories-column
  # ai quando a migrate e criada vamos colocar  umremovecolumn e dentro ( //nome da tabela , //coluna que eu quero exluir).... ↓
   - [x] await queryInterface.removeColumn('products','category');
   # DEPOIS DE REMOVIDO A COLUNA VAMOS ADICIONAR AGOR AUMA COM CHAVAE ESTRNAGEIRA.
    await queryInterface.addColumn('products', 'category_id',{
      type: Sequelize.INTEGER,
      references: {
        model: 'categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
      
      ## VAMOS LA O CODIGO ACIMA ESTA DIZENDO QUE VA NA TABELA PRODUTOS E CRIA UMA COLUNA CATEGORI_ID ONDE VAI SER DOI TIPO INTEIRO E VAI SE REFERENCIA A UMA TABELA DE CATEGORIES COM O ID SE SE ONUPDATE TIVER ALGUMA ALTERAÇÃO ENTAO VOCE MUDA NOS DOIS ...

      # VAMOS AVISAR PARA NOSSA MODEL QUE TEVE ALTERAÇAÕE PRECISAMOS JUNTAR ESSE CODIGO..
      - [x] vVAMOS EM PRODUTOS E CRIAMOS UM METODO STATIC COM O NOME ASSOCIEATE
      ## sendo que qua dentro dele damos um this.belongsto para dizer que vai pega vario produtos dentro da models referenciamso ele como chave estrangeira e dizxemos que semrpe motro como category
      - [ ]  static associate(models){
        this.belongsTo(models.Category,{
            foreignKey: 'category_id',
            as: 'category'
        })

    }
    - DEPOIS QUE ASSOIE VOU TER QUE IR NO INDEX DIZER PARA ELE O QUE VAMOS FAZER SE UM FOR VERDADEIRO ↓
    this.connection = new Sequelize(configDatabase);
        models.map((model) => model.init(this.connection)).map(model => model.associate && model.associate(this.connection.models),);

 - tIVE UQ MUDAR A PORTA PARA 3002
 # APROVEITEI QUE ESTAVA AQUI FIZ  ALTERAÇÃO DO CONTROLLER PARA  ELE MOSTRAR CATEGORY: ID E NOME
 - [ X] MUDAMOS O NOME QUE TA CATEGORY PARA CATEGORY_ID 
    const products = await Product.findAll({
    include: [
      {
        model: Category,
        as:   'category',
        attributes: ['id','name']
      
      }
    ]
  })
  ## CRIANDO CONEXÃO COM MONGODB
   - VAMOS CRIA UM CONTAINER DO DOCKER... NA PORTA PADRAO DELE 27017 O SEQUELIZE NÃO INTENDE MONGODB
   - [X] docker run --name devburger-mongo -p 27017:27017 -d -t mongo
## COMISSO VAMOS INTALAR O MONGOOSE
 -[x] yarn add mongoose
 sendo que fui direto no index.js 
 e no controctor colocaquie o this.mongo();
 e logo emseguida coloquei 
  - [x] mongo(){this.mongoConnection = mongoose.connect('mongodb://localhost:27017/devburger');
    }

- [x] como vamos fazer isso pelo mongo não precisamos criar uma migratrion... é chamado de schemafree

- [x] vamos criar uma pasta como nome  schemas quem vem com order.js vai ser com o schema ↓
 -  import mongoose from "mongoose";


const OderSchema = new mongoose.Schema({
    user:{
        id:{
            type: String,
            required: true,
        },
        name:{
            type: String,
            required:true,
        }
    },
    products:[
        {
            id:{
                type: Number,
                required: true,
            },
            name:{
               type: String,
               required:true, 
            },
            price:{
                type: Number,
                required: true,
            },
            category:{
                type: String,
                required: true,
            },
            url: {
         type :String,
         required:true,
            },
            quantity:{
                type: String,
                required: true
            }
        }
    ],
    status :{
        type: String,
        required: true,
    }
},{
    timestamps: true,
})

export default mongoose.model('Order', OderSchema);

## DEPOSI VAMOS CRIAR O CONTROLLER mas antes fizemso alguams alteraçoes no controller sesion 
- [x] no tokem foi adicionamdo  name: user.name
- [x] depois no auth do middleware vamoa adicionar o request.userName= dedoded.name

## AGORA VAMOS BUSCAR DADOS NO BANCO....
-[] const findProducts = await Product.findAll({
    where:{
      id: productsIds,
    }
  })

## desse jeito conseguimos pegar o que esta no banco porem precimaso de alguns codigos auxiliares sendo assim o codiog consegue criar um novo array com o map e mostrar os produtos com findall 
 - [1]  const productsIds = products.map((product) =>product.id)
 - [2] const order = {
    user:{
        id: request.userId,
        name: request.userName,
    },
    products: findProducts,
  }
  return response.status(201).json(order)


### TIVEMOS QUE PUXAR EM ORDEM  OS PRODUTOS...
    const formattedProducts = findProducts.map((product) =>{
  const newProduct = {
    id: product.id,
    name: product.name,
    category: product.category.name,
    price: product.price,
    url: product.url,
  };
  return newProduct
})
### VAMOS PUXAR O QUANTIDADE DE FORMA  QUE ELE VENHA SER VISTO  PORQUE ELE TEM NO BANO POREM SO VAI SER MOSTRADO QUANDO A PESSO PASSR O VALOR DE QUANTIDADE MAS PARA ISSO VAMOS VERIFICAR SE O ID ESTA CERTO SE FOR CERTO ENTAO NO ID 1 ADD A QUANTIDADE... ↓
const formattedProducts = findProducts.map((product) =>{
  const productIndex = products.findIndex((item) => item.id === product.id)
  const newProduct = {
    id: product.id,
    name: product.name,
    category: product.category.name,
    price: product.price,
    url: product.url,
    quantity: products[productIndex],
  };
