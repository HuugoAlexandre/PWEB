const express = require('express');
const app = express();
const port = 3000;
// Configurar EJS como template engine
app.set('view engine', 'ejs');
// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));
// Rota principal
app.get('/', (req, res) => {
res.render('index', { title: 'Minha Aplicação Express' });
});

app.get('/sobre', (req, res) => {
res.render('sobre', { title: 'Sobre Nós' });
});

app.get('/contato', (req, res) => {
res.render('contato', { title: 'Contato' });
});

app.get('/servicos', (req, res) => {
  const servicos = ['Desenvolvimento Web', 'APIs com Node.js', 'Integrações com Banco de Dados'];
  res.render('servicos', { title: 'Serviços', servicos });
});

// Iniciar o servidor
app.listen(port, () => {
console.log(`Servidor rodando em http://localhost:${port}`);
});