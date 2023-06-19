const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const menuFilePath = 'menu.json';

// Endpoint para adicionar um item ao cardápio.
//Lucas esteve aqui
app.post('/menu', (req, res) => {
  const { id, nome, descricao, preco } = req.body;

  // Carrega o menu atual a partir do arquivo
  let menu = loadMenu();

  // Verifica se o item já existe no menu
  if (menu.some(item => item.id === id)) {
    return res.status(400).json({ error: 'Item already exists in the menu.' });
  }

  // Adiciona o novo item ao menu
  const newItem = { id, nome, descricao, preco };
  menu.push(newItem);

  // Salva o menu atualizado no arquivo
  saveMenu(menu);

  return res.status(201).json(newItem);
});

// Endpoint para retornar o cardápio completo
app.get('/menu', (req, res) => {
  const menu = loadMenu();
  return res.json(menu);
});

// Endpoint para retornar um item específico do cardápio por ID
app.get('/menu/:id', (req, res) => {
  const { id } = req.params;
  const menu = loadMenu();
  const item = menu.find(item => item.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  return res.json(item);
});

// Endpoint para alterar um item do cardápio
app.put('/menu/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco } = req.body;
  const menu = loadMenu();
  const itemIndex = menu.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  const updatedItem = { id, nome, descricao, preco };
  menu[itemIndex] = updatedItem;

  saveMenu(menu);

  return res.json(updatedItem);
});

// Endpoint para excluir um item do cardápio
app.delete('/menu/:id', (req, res) => {
  const { id } = req.params;
  const menu = loadMenu();
  const itemIndex = menu.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  const deletedItem = menu.splice(itemIndex, 1)[0];

  saveMenu(menu);

  return res.json(deletedItem);
});

// Função auxiliar para carregar o menu a partir do arquivo
function loadMenu() {
  try {
    const menuData = fs.readFileSync(menuFilePath, 'utf8');
    return JSON.parse(menuData);
  } catch (error) {
    return [];
  }
}

// Função auxiliar para salvar o menu no arquivo
function saveMenu(menu) {
  const menuData = JSON.stringify(menu, null, 2);
  fs.writeFileSync(menuFilePath, menuData, 'utf8');
}

// Inicia o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
