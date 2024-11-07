Para rodar o projeto
Primeiro instalar o pacote pelo comando: 
npm i

rodar o projeto
npn run dev

Configurar o servidor:
Acessar pasta server terminal e rodar "npm i" também
 
(lembre de ter MySql instalado, configurar a senha no datasource.datasource.ts e ter um banco de dados com nome "db" criado)

instalar certificado para https (requisitado para carregar as imagens do servidor):
- acessar pasta .cert e abrir no explorer
- executar arquivo cert.crt
- instalar para Máquina Local 
- selecionar Colocar todos os certificados no repositório a seguir
- selecionar Autoridades de Certificado Raíz Confiávies

Executar
npm run build
npm run migrate -- --rebuild

npm run dev

erros:
Caso tenha algum problema ao rodar "npm run dev" no server, remover package-lock.json e node_modules e instalar novamente
Se o servidor continuar não rodando, verificar a versão do node.js e se existe algum erro nas dependências
(não recomendado atualizar as dependências para rodar o projeto, visto que não foi testado em novas versões)