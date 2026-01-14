# ⚙️ Configuração da API

## 🔧 Como Configurar

1. Abra o arquivo: `src/config/api.js`
2. Altere as URLs conforme seu ambiente

---

## 📍 Ambientes

### **Desenvolvimento Local (Emulador)**
```javascript
const API_BASE_URL = 'http://localhost:8080';
const AUTH_BASE_URL = 'http://localhost:3000';
```

### **Desenvolvimento Local (Dispositivo Físico)**
```javascript
// Substitua 192.168.1.100 pelo IP da sua máquina
const API_BASE_URL = 'http://192.168.1.100:8080';
const AUTH_BASE_URL = 'http://192.168.1.100:3000';
```

### **Produção (Exemplo)**
```javascript
const API_BASE_URL = 'https://api.seudominio.com';
const AUTH_BASE_URL = 'https://auth.seudominio.com';
```

---

## 🔍 Como Descobrir Seu IP

### Windows
```bash
ipconfig
```
Procure por "Endereço IPv4" na seção Wi-Fi

### macOS / Linux
```bash
ifconfig
# ou
ip addr
```

---

## ✅ Testar Conexão

1. Abra no navegador:
   - Backend: http://SEU_IP:8080/swagger-ui.html
   - Auth: http://SEU_IP:3000/health

2. Se abrir, a configuração está correta!

---

## 🔐 Segurança

⚠️ **NUNCA** commite credenciais reais no código  
⚠️ Use variáveis de ambiente em produção  
⚠️ Configure HTTPS/SSL em produção  

---

## 📊 Estrutura de Endpoints

```
Auth Service (Node.js) - Porta 3000
├── POST /api/register     - Registrar usuário
└── POST /api/login        - Login e obter token

API Service (Spring Boot) - Porta 8080
├── Categorias
│   ├── GET    /api/categorias         - Listar
│   ├── POST   /api/categorias         - Criar
│   ├── GET    /api/categorias/:id     - Buscar
│   ├── PUT    /api/categorias/:id     - Atualizar
│   └── DELETE /api/categorias/:id     - Deletar
│
└── Gastos
    ├── GET    /api/gastos              - Listar
    ├── POST   /api/gastos              - Criar
    ├── GET    /api/gastos/categoria/:id - Por categoria
    └── DELETE /api/gastos/:id          - Deletar
```

---

**Configuração Concluída! ✨**
