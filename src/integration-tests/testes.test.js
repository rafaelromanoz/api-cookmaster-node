const chai = require('chai');
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const directory = path.resolve(__dirname, '..', 'uploads');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;
const { getConnection } = require('./connectionMockMongo');
const { MongoClient } = require('mongodb');
const server = require('../api/app');
const { response } = require('../api/app');

describe('POST /users', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Se é criado um usuário da maneira correta', () => {
    let response;
    before(async () => {
      response = await chai.request(server).post('/users').send({
        name: 'Teste',
        email: 'ra-kun@hotmail.com',
        password: '123',
      });
    });
    it('Retorna o código de status 201', () => {
      expect(response).to.have.status(201);
    });
    it('Retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });
    it('O objeto possui a propriedade user', () => {
      expect(response.body).to.have.a.property('user');
    });
    it('O objeto possui a propriedade ', () => {
      expect(response.body.user).to.have.a.property('name');
    });
    it('O objeto possui a propriedade role', () => {
      expect(response.body.user).to.have.a.property('role');
    });
  });
  describe('Se da erro ao tentar cadastrar usuário com as propriedades erradas ou repetidas', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        username: 'rafa-kun@hotmail.com',
        password: '123',
      });
      response = await chai.request(server).post('/users').send({
        email: 'rafa-kun@hotmail.com',
        password: '123',
      });
    });
    it('Se ao passar sem a propriedade name da erro', () => {
      expect(response).to.have.status(400);
    });
    it('Se ao passar informações erradas venha um objeto', () => {
      expect(response).to.be.an('object');
    });
    it('Se ao passar o mesmo usuário', () => {
      expect(response.body).to.have.a.property('message');
    });
    it('Ter o status correto', () => {
      expect(response).to.have.status(400);
    });
  });
});

describe('POST /login', () => {
  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });
  describe('quando usuário e/ou senha não são informados', () => {
    let response;
    before(async () => {
      response = await chai.request(server).post('/login').send({});
    });
    it('Retorna o status correto', () => {
      expect(response).to.have.status(401);
    });
    it('Retorna a mensagem correta', () => {
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });
  describe('Quando são informados email ou senha inválida', () => {
    let response;
    before(async () => {
      response = await chai.request(server).post('/login').send({
        email: 'raflac@hop.com',
        password: '1234',
      });
    });
    it('Retorna o status correto', () => {
      expect(response).to.have.status(401);
    });
    it('Retorna a mensagem correta', () => {
      expect(response.body.message).to.be.equal(
        'Incorrect username or password'
      );
    });
  });
  describe('Quando o login é feito corretamente', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'teasad',
        email: 'teste@gmail.com',
        password: '122465',
      });
      response = await chai.request(server).post('/login').send({
        email: 'teste@gmail.com',
        password: '122465',
      });
    });
    it('Retorna o status correto do login', () => {
      expect(response).to.have.status(200);
    });
    it('Retorna a mensagem correta', () => {
      expect(response.body).to.have.a.property('token');
    });
  });
});

describe('POST /recipes', () => {
  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Quando não é enviado um JWT para autenticação', () => {
    let response;
    before(async () => {
      response = await chai.request(server).post('/recipes');
    });
    it('Retorna o status correto', () => {
      expect(response).to.have.status(401);
    });
    it('Retorna a mensagem correta', () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });
  describe('Quando é passado um JWT inválido', () => {
    let response;
    before(async () => {
      response = await chai
        .request(server)
        .post('/recipes')
        .set('authorization', 'asd');
    });
    it('Se é retornado o status "401"', () => {
      expect(response).to.have.status(401);
    });
    it('Se retorna a mensagem jwt malformed', () => {
      expect(response.body.message).to.be.equal('jwt malformed');
    });
  });

  describe('Quando é passado o jwt correto porém não é passado as coisas corretas', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'Rafael',
        email: 'rafa-kun@hotmail.com',
        password: '123',
      });

      const token = await chai
        .request(server)
        .post('/login')
        .send({
          email: 'rafa-kun@hotmail.com',
          password: '123',
        })
        .then((res) => res.body);

      response = await chai
        .request(server)
        .post('/recipes')
        .send({
          ingredients: 'feijão',
          preparation: 'mistura tudo e deixa ferver e é isso',
        })
        .set('authorization', token.token);
    });
    it('Se o status veio correto', () => {
      expect(response).to.have.status(400);
    });
    it('Se a mensagem veio correta', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });
  describe('Se o produto é cadastrado com sucesso', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'Rafael',
        email: 'rafa-kun@hotmail.com',
        password: '123',
      });

      const token = await chai
        .request(server)
        .post('/login')
        .send({
          email: 'rafa-kun@hotmail.com',
          password: '123',
        })
        .then((res) => res.body);

      response = await chai
        .request(server)
        .post('/recipes')
        .send({
          name: 'Feijoada',
          ingredients: 'feijão',
          preparation: 'mistura tudo e deixa ferver e é isso',
        })
        .set('authorization', token.token);
    });
    it('Se o status é correto', () => {
      expect(response).to.have.status(201);
    });
    it('Se o resultado tenha a propriedade recipe', () => {
      expect(response.body).to.have.a.property('recipe');
    });
    it('Se possui a propriedade _id', () => {
      expect(response.body.recipe).to.have.a.property('_id');
    });
  });
});

describe('GET /recipes', () => {
  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Se retorna todas recipes', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'Rafael',
        email: 'rafa-kun@hotmail.com',
        password: '123',
      });

      response = await chai.request(server).get('/recipes');
    });
    it('Se retorna um array ', () => {
      expect(response.body).to.be.an('array');
    });
    it('Se retorna o status correto', () => {
      expect(response).to.have.status(200);
    });
  });
});

describe('GET /recipes:id', () => {
  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Se retorna todas recipes', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'Rafael',
        email: 'rafa-kun@hotmail.com',
        password: '123',
      });

      const token = await chai
        .request(server)
        .post('/login')
        .send({
          email: 'rafa-kun@hotmail.com',
          password: '123',
        })
        .then((res) => res.body);

      const { insertedId } = await connectionMock
        .db('Cookmaster')
        .collection('recipes')
        .insertOne({
          name: 'Feijoada',
          ingredients: 'feijão',
          preparation: 'mistura tudo e deixa ferver e é isso',
        });

      response = await chai.request(server).get(`/recipes/${insertedId}`);
    });
    it('Se retorna um array ', () => {
      expect(response.body).to.be.an('object');
    });
    it('Se retorna o status correto', () => {
      expect(response).to.have.status(200);
    });
    it('Se tiver a propriedade correta _id', () => {
      expect(response.body).to.have.a.property('_id');
    });
  });
  describe('Se não encontra a receita', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'Rafael',
        email: 'rafa-kun@hotmail.com',
        password: '123',
      });

      const token = await chai
        .request(server)
        .post('/login')
        .send({
          email: 'rafa-kun@hotmail.com',
          password: '123',
        })
        .then((res) => res.body);

      const { insertedId } = await connectionMock
        .db('Cookmaster')
        .collection('recipes')
        .insertOne({
          name: 'Feijoada',
          ingredients: 'feijão',
          preparation: 'mistura tudo e deixa ferver e é isso',
        });

      response = await chai.request(server).get(`/recipes/${insertedId}o`);
    });
    it('Se o status é certo', () => {
      expect(response).to.have.status(404);
    });
  });
});

describe('PUT /recipes/:id', () => {
  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Quando realiza o update com sucesso', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'Rafael',
        email: 'rafa-kun@hotmail.com',
        password: '123',
      });

      const token = await chai
        .request(server)
        .post('/login')
        .send({
          email: 'rafa-kun@hotmail.com',
          password: '123',
        })
        .then((res) => res.body);

      const { insertedId } = await connectionMock
        .db('Cookmaster')
        .collection('recipes')
        .insertOne({
          name: 'Feijoada',
          ingredients: 'feijão',
          preparation: 'mistura tudo e deixa ferver e é isso',
        });

      response = await chai
        .request(server)
        .put(`/recipes/${insertedId}`)
        .set('authorization', token.token)
        .send({
          name: 'Comida braba',
          ingredients: 'batata frita, bife, salada de tomate',
          preparation: 'ta pronto',
        });
    });
    it('Se retorna o status certo', () => {
      expect(response).to.have.status(200);
    });
  });
  describe('Se não foi passado o id correto', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'Rafael',
        email: 'rafa-kun@hotmail.com',
        password: '123',
      });

      const token = await chai
        .request(server)
        .post('/login')
        .send({
          email: 'rafa-kun@hotmail.com',
          password: '123',
        })
        .then((res) => res.body);

      const { insertedId } = await connectionMock
        .db('Cookmaster')
        .collection('recipes')
        .insertOne({
          name: 'Feijoada',
          ingredients: 'feijão',
          preparation: 'mistura tudo e deixa ferver e é isso',
        });
      response = await chai
        .request(server)
        .put(`/recipes/${insertedId}i`)
        .set('authorization', token.token)
        .send({
          name: 'Comida braba',
          ingredients: 'batata frita, bife, salada de tomate',
          preparation: 'ta pronto',
        });
    });
    it('Se recebe o status correto', () => {
      expect(response).to.have.status(400);
    });
    it('Se é um objeto', () => {
      expect(response.body).to.be.an('object');
    });
    it('Se possui a mensagem correta', () => {
      expect(response.body).to.have.a.property('message');
    });
  });
});

describe('Delete /recipes/:id', () => {
  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Se é bem excluido', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'Rafael',
        email: 'rafa-kun@hotmail.com',
        password: '123',
      });

      const token = await chai
        .request(server)
        .post('/login')
        .send({
          email: 'rafa-kun@hotmail.com',
          password: '123',
        })
        .then((res) => res.body);

      const { insertedId } = await connectionMock
        .db('Cookmaster')
        .collection('recipes')
        .insertOne({
          name: 'Feijoada',
          ingredients: 'feijão',
          preparation: 'mistura tudo e deixa ferver e é isso',
        });
      response = await chai
        .request(server)
        .delete(`/recipes/${insertedId}`)
        .set('authorization', token.token);
    });
    it('Se o status retornado é certo', () => {
      expect(response).to.have.status(204);
    });
  });
});

describe('POST /users/admin', () => {
  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Se cria um usuário admin', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'admin',
        email: 'root@email.com',
        password: 'admin',
        role: 'admin',
      });

      const token = await chai
        .request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then((res) => res.body);

      response = await chai
        .request(server)
        .post('/users/admin')
        .set('authorization', token.token)
        .send({
          name: 'Cloud Strife',
          email: 'cloud@gmail.com',
          password: '4577952665',
        });
    });
    it('Se o status retornado é certo admin', () => {
      expect(response).to.have.status(201);
    });
  });
});

describe('Testando PUT /:id/image', () => {
  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Se vem a imagem certa', () => {
    let response;
    before(async() => {
      const usersCollection = connectionMock
        .db('Cookmaster')
        .collection('users');
      await usersCollection.insertOne({
        name: 'admin',
        email: 'root@email.com',
        password: 'admin',
        role: 'admin',
      });

      const token = await chai
        .request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then((res) => res.body);

        const { insertedId } = await connectionMock
        .db('Cookmaster')
        .collection('recipes')
        .insertOne({
          name: 'Feijoada',
          ingredients: 'feijão',
          preparation: 'mistura tudo e deixa ferver e é isso',
        });
      

      response = await chai
        .request(server)
        .put(`/recipes/${insertedId}/image`)
        .set('authorization', token.token)
        .set('content-type', 'multipart/form-data')
        .attach('image', fs.readFileSync(`${directory}/ratinho.jpg`), 'file');
      console.log(response);
    });
    it('Se a resposta é um jpeg', () => {
      expect(response.body).to.have.a.property('image');
    });
  });
});