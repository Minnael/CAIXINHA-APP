# ⚡ Quick Start - Controle de Gastos App

## 🎯 Executar em 3 Minutos

### 1️⃣ Instalar Dependências
```bash
cd controle-gastos-app
npm install
```

### 2️⃣ Configurar URLs (IMPORTANTE!)

Edite `src/config/api.js`:

**Para emulador/simulador:**
```javascript
const API_BASE_URL = 'http://localhost:8080';
const AUTH_BASE_URL = 'http://localhost:3000';
```

**Para dispositivo físico:**
```javascript
// Substitua pelo IP da sua máquina (execute ipconfig no Windows)
const API_BASE_URL = 'http://192.168.1.100:8080';
const AUTH_BASE_URL = 'http://192.168.1.100:3000';
```

### 3️⃣ Iniciar
```bash
npm start
```

Escaneie o QR Code com o app **Expo Go** no seu celular.

---

## ✅ Checklist Antes de Rodar

- [ ] Backend Spring Boot rodando em http://localhost:8080
- [ ] Auth Service Node.js rodando em http://localhost:3000
- [ ] MongoDB Atlas configurado e acessível
- [ ] Node.js 18+ instalado
- [ ] Expo Go instalado no celular (para teste em dispositivo físico)

---

## 🔥 Primeiro Uso

1. **Registrar**
   - Clique em "Cadastre-se"
   - Usuário: `teste`
   - Senha: `123456`

2. **Criar Categoria**
   - Nome: `Alimentação`
   - Ícone: `🍔`
   - Meta: `1000`

3. **Adicionar Gasto**
   - Nome: `Almoço`
   - Valor: `50`
   - Categoria: `Alimentação`

---

## 🐛 Problemas Comuns

**Erro de Conexão:**
- Verifique se backend está rodando: http://localhost:8080/swagger-ui.html
- Use IP da máquina se estiver em dispositivo físico

**Token Expirado:**
- Faça logout e login novamente
- Token expira em 1 hora

---

## 📱 Testar em Dispositivo Físico

1. Celular e computador na **mesma rede Wi-Fi**
2. Descubra o IP da máquina:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`
3. Edite `src/config/api.js` com o IP
4. Execute `npm start` e escaneie o QR Code

---

## 🎨 Features Principais

✅ Login/Registro  
✅ Criar/Editar/Deletar Categorias  
✅ Adicionar/Deletar Gastos  
✅ Barra de Progresso (Gasto vs Meta)  
✅ Filtro por Categoria  
✅ Navegação por Tabs  

---

**Pronto! 🚀 O app está 100% integrado com o backend.**
