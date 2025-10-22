import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getTestPage(): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CRUD API - Teste Interativo</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      margin-bottom: 30px;
      text-align: center;
    }

    h1 {
      color: #667eea;
      margin-bottom: 10px;
      font-size: 2.5em;
    }

    .subtitle {
      color: #666;
      font-size: 1.1em;
    }

    .status {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9em;
      margin-top: 10px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    .card h2 {
      color: #667eea;
      margin-bottom: 15px;
      font-size: 1.5em;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .endpoint {
      background: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
      border-left: 4px solid #667eea;
    }

    .method {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 0.85em;
      margin-right: 10px;
    }

    .get { background: #10b981; color: white; }
    .post { background: #3b82f6; color: white; }
    .patch { background: #f59e0b; color: white; }
    .delete { background: #ef4444; color: white; }

    .endpoint-path {
      font-family: 'Courier New', monospace;
      color: #374151;
      font-weight: 600;
    }

    .test-section {
      background: white;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .test-section h2 {
      color: #667eea;
      margin-bottom: 20px;
    }

    .test-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1em;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
    }

    button:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .btn-primary { background: #667eea; }
    .btn-success { background: #10b981; }
    .btn-warning { background: #f59e0b; }
    .btn-danger { background: #ef4444; }

    #output {
      background: #1e293b;
      color: #10b981;
      padding: 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      max-height: 400px;
      overflow-y: auto;
      margin-top: 20px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .footer {
      text-align: center;
      color: white;
      margin-top: 30px;
      font-size: 0.9em;
    }

    .icon {
      font-size: 1.3em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 CRUD API - Web Backend</h1>
      <p class="subtitle">API REST com NestJS + Prisma + PostgreSQL</p>
      <span class="status">✅ API Online</span>
    </div>

    <div class="grid">
      <div class="card">
        <h2><span class="icon">👤</span> Usuários</h2>
        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="endpoint-path">/users</span>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="endpoint-path">/users</span>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="endpoint-path">/users/:id</span>
        </div>
        <div class="endpoint">
          <span class="method patch">PATCH</span>
          <span class="endpoint-path">/users/:id</span>
        </div>
        <div class="endpoint">
          <span class="method delete">DELETE</span>
          <span class="endpoint-path">/users/:id</span>
        </div>
      </div>

      <div class="card">
        <h2><span class="icon">📝</span> Posts</h2>
        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="endpoint-path">/posts</span>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="endpoint-path">/posts</span>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="endpoint-path">/posts/:id</span>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="endpoint-path">/posts/author/:id</span>
        </div>
        <div class="endpoint">
          <span class="method patch">PATCH</span>
          <span class="endpoint-path">/posts/:id</span>
        </div>
        <div class="endpoint">
          <span class="method delete">DELETE</span>
          <span class="endpoint-path">/posts/:id</span>
        </div>
      </div>

      <div class="card">
        <h2><span class="icon">🏥</span> Health Check</h2>
        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="endpoint-path">/health</span>
        </div>
        <p style="margin-top: 15px; color: #666;">Verifica se a API está funcionando corretamente.</p>
      </div>
    </div>

    <div class="test-section">
      <h2>🧪 Testar API</h2>
      <div class="test-buttons">
        <button class="btn-success" onclick="testHealthCheck()">Health Check</button>
        <button class="btn-primary" onclick="createUser()">Criar Usuário</button>
        <button class="btn-primary" onclick="listUsers()">Listar Usuários</button>
        <button class="btn-danger" onclick="deleteUser()">Deletar Usuário</button>
        <button class="btn-primary" onclick="createPost()">Criar Post</button>
        <button class="btn-primary" onclick="listPosts()">Listar Posts</button>
        <button class="btn-warning" onclick="updatePost()">Atualizar Post</button>
        <button class="btn-danger" onclick="deletePost()">Deletar Post</button>
        <button class="btn-danger" onclick="clearOutput()">Limpar Console</button>
      </div>
      <div id="output">Console de saída:\n\nClique nos botões acima para testar a API...</div>
    </div>

    <div class="footer">
      <p>🔗 Backend rodando em <strong>http://localhost:3001</strong></p>
      <p>📚 Documentação completa: README_API.md | API_TESTS.md</p>
    </div>
  </div>

  <script>
    const API_URL = 'http://localhost:3001';
    const output = document.getElementById('output');

    function log(message, type = 'info') {
      const timestamp = new Date().toLocaleTimeString('pt-BR');
      const colors = {
        info: '#10b981',
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b'
      };
      output.innerHTML += \`\\n[\${timestamp}] \${message}\`;
      output.scrollTop = output.scrollHeight;
    }

    function clearOutput() {
      output.innerHTML = 'Console de saída:\\n\\nClique nos botões acima para testar a API...';
    }

    async function testHealthCheck() {
      try {
        log('🏥 Testando Health Check...', 'info');
        const response = await fetch(\`\${API_URL}/health\`);
        const data = await response.json();
        log(\`✅ SUCESSO: \${JSON.stringify(data, null, 2)}\`, 'success');
      } catch (error) {
        log(\`❌ ERRO: \${error.message}\`, 'error');
      }
    }

    async function createUser() {
      try {
        const randomNum = Math.floor(Math.random() * 10000);
        const user = {
          fullName: \`Usuário Teste \${randomNum}\`,
          username: \`user\${randomNum}\`,
          email: \`user\${randomNum}@example.com\`,
          password: 'senha123'
        };
        
        log(\`👤 Criando usuário: \${user.username}...\`, 'info');
        const response = await fetch(\`\${API_URL}/users\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        
        const data = await response.json();
        if (response.ok) {
          log(\`✅ Usuário criado com sucesso!\\n\${JSON.stringify(data, null, 2)}\`, 'success');
        } else {
          log(\`❌ Erro ao criar usuário: \${JSON.stringify(data, null, 2)}\`, 'error');
        }
      } catch (error) {
        log(\`❌ ERRO: \${error.message}\`, 'error');
      }
    }

    async function listUsers() {
      try {
        log('👥 Listando todos os usuários...', 'info');
        const response = await fetch(\`\${API_URL}/users\`);
        const data = await response.json();
        log(\`✅ Encontrados \${data.length} usuários:\\n\${JSON.stringify(data, null, 2)}\`, 'success');
      } catch (error) {
        log(\`❌ ERRO: \${error.message}\`, 'error');
      }
    }

    async function createPost() {
      try {
        log('📝 Criando post...', 'info');
        
        // Primeiro, busca um usuário para ser o autor
        const usersResponse = await fetch(\`\${API_URL}/users\`);
        const users = await usersResponse.json();
        
        if (users.length === 0) {
          log('⚠️ Nenhum usuário encontrado. Crie um usuário primeiro!', 'warning');
          return;
        }
        
        const post = {
          title: \`Post de Teste - \${new Date().toLocaleString('pt-BR')}\`,
          content: 'Este é um post de teste criado pela interface web!',
          published: false,
          authorId: users[0].id
        };
        
        const response = await fetch(\`\${API_URL}/posts\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post)
        });
        
        const data = await response.json();
        if (response.ok) {
          log(\`✅ Post criado com sucesso!\\n\${JSON.stringify(data, null, 2)}\`, 'success');
        } else {
          log(\`❌ Erro ao criar post: \${JSON.stringify(data, null, 2)}\`, 'error');
        }
      } catch (error) {
        log(\`❌ ERRO: \${error.message}\`, 'error');
      }
    }

    async function listPosts() {
      try {
        log('📚 Listando todos os posts...', 'info');
        const response = await fetch(\`\${API_URL}/posts\`);
        const data = await response.json();
        log(\`✅ Encontrados \${data.length} posts:\\n\${JSON.stringify(data, null, 2)}\`, 'success');
      } catch (error) {
        log(\`❌ ERRO: \${error.message}\`, 'error');
      }
    }

    async function updatePost() {
      try {
        log('✏️ Atualizando post...', 'info');
        
        const postsResponse = await fetch(\`\${API_URL}/posts\`);
        const posts = await postsResponse.json();
        
        if (posts.length === 0) {
          log('⚠️ Nenhum post encontrado. Crie um post primeiro!', 'warning');
          return;
        }
        
        const postId = posts[0].id;
        const update = {
          title: \`Post Atualizado - \${new Date().toLocaleString('pt-BR')}\`,
          published: true
        };
        
        const response = await fetch(\`\${API_URL}/posts/\${postId}\`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        });
        
        const data = await response.json();
        if (response.ok) {
          log(\`✅ Post atualizado com sucesso!\\n\${JSON.stringify(data, null, 2)}\`, 'success');
        } else {
          log(\`❌ Erro ao atualizar post: \${JSON.stringify(data, null, 2)}\`, 'error');
        }
      } catch (error) {
        log(\`❌ ERRO: \${error.message}\`, 'error');
      }
    }

    async function deleteUser() {
      try {
        log('🗑️ Deletando usuário...', 'info');
        
        const usersResponse = await fetch(\`\${API_URL}/users\`);
        const users = await usersResponse.json();
        
        if (users.length === 0) {
          log('⚠️ Nenhum usuário encontrado para deletar!', 'warning');
          return;
        }
        
        // Deleta o último usuário da lista
        const userId = users[users.length - 1].id;
        const userName = users[users.length - 1].fullName;
        
        log(\`🗑️ Deletando usuário ID \${userId} (\${userName})...\`, 'info');
        
        const response = await fetch(\`\${API_URL}/users/\${userId}\`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        if (response.ok) {
          log(\`✅ Usuário deletado com sucesso!\\n\${JSON.stringify(data, null, 2)}\`, 'success');
        } else {
          log(\`❌ Erro ao deletar usuário: \${JSON.stringify(data, null, 2)}\`, 'error');
        }
      } catch (error) {
        log(\`❌ ERRO: \${error.message}\`, 'error');
      }
    }

    async function deletePost() {
      try {
        log('🗑️ Deletando post...', 'info');
        
        const postsResponse = await fetch(\`\${API_URL}/posts\`);
        const posts = await postsResponse.json();
        
        if (posts.length === 0) {
          log('⚠️ Nenhum post encontrado para deletar!', 'warning');
          return;
        }
        
        // Deleta o último post da lista
        const postId = posts[posts.length - 1].id;
        const postTitle = posts[posts.length - 1].title;
        
        log(\`🗑️ Deletando post ID \${postId} (\${postTitle})...\`, 'info');
        
        const response = await fetch(\`\${API_URL}/posts/\${postId}\`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        if (response.ok) {
          log(\`✅ Post deletado com sucesso!\\n\${JSON.stringify(data, null, 2)}\`, 'success');
        } else {
          log(\`❌ Erro ao deletar post: \${JSON.stringify(data, null, 2)}\`, 'error');
        }
      } catch (error) {
        log(\`❌ ERRO: \${error.message}\`, 'error');
      }
    }

    // Testa a conexão ao carregar a página
    window.addEventListener('load', () => {
      log('🚀 Interface carregada com sucesso!', 'success');
      log('💡 Dica: Clique em "Health Check" para verificar se a API está funcionando.', 'info');
    });
  </script>
</body>
</html>
    `;
  }
}

