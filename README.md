# 📱 Controle de Gastos - Mobile App

Aplicativo React Native (Expo) para gerenciamento de gastos por categoria, totalmente integrado com o backend Spring Boot.

## 🎯 **Funcionalidades**

### ✅ Autenticação
- Registro de novo usuário
- Login com credenciais
- Logout seguro
- Armazenamento seguro de token JWT

### ✅ Categorias
- Listar todas as categorias do usuário
- Criar nova categoria com meta mensal
- Editar categoria existente
- Deletar categoria (apenas sem gastos vinculados)
- Visualizar detalhes da categoria com todos os gastos
- Cálculo automático: Gasto Atual vs Meta Mensal
- Barra de progresso visual

### ✅ Gastos
- Listar todos os gastos
- Criar novo gasto vinculado a categoria
- Deletar gasto
- Filtrar gastos por categoria
- Visualização do total geral de gastos

---

## 🏗️ **Arquitetura**

```
controle-gastos-app/
├── App.js                      # Componente raiz
├── app.json                    # Configuração Expo
├── package.json                # Dependências
├── babel.config.js             # Configuração Babel
│
├── src/
│   ├── config/
│   │   └── api.js              # URLs base da API
│   │
│   ├── services/
│   │   ├── apiClient.js        # Axios configurado com interceptors
│   │   ├── storage.js          # SecureStore (token/usuário)
│   │   ├── authService.js      # Serviço de autenticação
│   │   ├── categoriaService.js # Serviço de categorias
│   │   └── gastoService.js     # Serviço de gastos
│   │
│   ├── contexts/
│   │   ├── AuthContext.js      # Estado global de autenticação
│   │   ├── CategoriaContext.js # Estado global de categorias
│   │   └── GastoContext.js     # Estado global de gastos
│   │
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── CategoriasListScreen.js
│   │   ├── CategoriaFormScreen.js
│   │   ├── CategoriaDetalhesScreen.js
│   │   ├── GastosListScreen.js
│   │   └── GastoFormScreen.js
│   │
│   ├── components/
│   │   ├── Button.js           # Botão customizado
│   │   ├── Input.js            # Input customizado
│   │   ├── Loading.js          # Indicador de loading
│   │   └── ErrorMessage.js     # Mensagem de erro
│   │
│   ├── navigation/
│   │   └── AppNavigator.js     # Configuração de navegação
│   │
│   └── styles/
│       └── theme.js            # Tema global (cores, espaçamentos)
```

---

## 🚀 **Como Executar**

### **Pré-requisitos**
- Node.js 18+ instalado
- Expo CLI instalado globalmente: `npm install -g expo-cli`
- Backend Spring Boot rodando em `http://localhost:8080`
- Microserviço Auth Node.js rodando em `http://localhost:3000`

### **1. Instalar Dependências**
```bash
cd controle-gastos-app
npm install
```

### **2. Configurar URLs da API**
Edite o arquivo `src/config/api.js`:

```javascript
// Para testar em dispositivo físico, use o IP da sua máquina
const API_BASE_URL = 'http://192.168.1.100:8080';  // Altere para seu IP
const AUTH_BASE_URL = 'http://192.168.1.100:3000'; // Altere para seu IP
```

**Como descobrir seu IP:**
- **Windows**: `ipconfig` (procure por "Endereço IPv4")
- **macOS/Linux**: `ifconfig` ou `ip addr`

### **3. Iniciar o Aplicativo**

#### **Executar no Emulador/Simulador**
```bash
npm run android   # Android
npm run ios       # iOS (apenas macOS)
```

#### **Executar em Dispositivo Físico**
```bash
npm start
```
Isso abrirá o Expo Developer Tools no navegador. Use o app **Expo Go** no seu smartphone para escanear o QR Code.

**Download Expo Go:**
- Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## 🔌 **Integração com Backend**

### **Endpoints Utilizados**

#### **Autenticação (Node.js - porta 3000)**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/register` | Registrar usuário |
| POST | `/api/login` | Login e obter token JWT |

#### **Categorias (Spring Boot - porta 8080)**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categorias` | Listar categorias |
| POST | `/api/categorias` | Criar categoria |
| GET | `/api/categorias/:id` | Buscar categoria com gastos |
| PUT | `/api/categorias/:id` | Atualizar categoria |
| DELETE | `/api/categorias/:id` | Deletar categoria |

#### **Gastos (Spring Boot - porta 8080)**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/gastos` | Listar gastos |
| POST | `/api/gastos` | Criar gasto |
| GET | `/api/gastos/categoria/:id` | Listar por categoria |
| DELETE | `/api/gastos/:id` | Deletar gasto |

### **Autenticação**
Todas as requisições para a API Spring Boot incluem automaticamente o header:
```
Authorization: Bearer <token_jwt>
```

O token é obtido no login e armazenado de forma segura usando **Expo SecureStore**.

---

## 📦 **Dependências Principais**

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| expo | ~50.0.0 | Framework React Native |
| react-navigation | ^6.1.9 | Navegação entre telas |
| axios | ^1.6.5 | Requisições HTTP |
| expo-secure-store | ~12.8.1 | Armazenamento seguro (token) |
| @react-native-picker/picker | 2.6.1 | Seletor de categorias |

---

## 🎨 **Design System**

### **Cores**
- **Primary**: `#6366f1` (Indigo) - Botões principais, header
- **Secondary**: `#10b981` (Green) - Valores positivos, sucesso
- **Error**: `#ef4444` (Red) - Erros, valores excedidos
- **Background**: `#f9fafb` - Fundo geral
- **Surface**: `#ffffff` - Cards, modais

### **Componentes Reutilizáveis**
- **Button**: 4 variantes (primary, secondary, outline, danger)
- **Input**: Validação visual, ícones, multiline
- **Loading**: Indicador centralizado com mensagem
- **ErrorMessage**: Banner de erro com borda colorida

---

## 🔒 **Segurança**

### **✅ Implementado**
- Armazenamento seguro de token com Expo SecureStore
- Validação de formulários no cliente
- Interceptor Axios para adicionar token automaticamente
- Logout automático em caso de token expirado (401)
- Limpeza de contexto ao fazer logout

### **⚠️ Recomendações Adicionais**
- Implementar refresh token (atualmente token expira em 1 hora)
- Adicionar rate limiting no backend
- Implementar certificado SSL/TLS em produção (HTTPS)
- Validação de certificados SSL em produção

---

## 🐛 **Troubleshooting**

### **Erro: "Servidor não está respondendo"**
✅ **Solução:**
1. Verifique se o backend está rodando: `http://localhost:8080`
2. Verifique se o auth service está rodando: `http://localhost:3000`
3. Se estiver testando em dispositivo físico, use o IP da máquina no `api.js`
4. Certifique-se de estar na mesma rede Wi-Fi

### **Erro: "Token inválido ou expirado"**
✅ **Solução:**
1. Faça logout e login novamente
2. Token expira em 1 hora por padrão
3. Verifique se a `JWT_SECRET` é a mesma no backend e auth service

### **Erro ao carregar categorias/gastos**
✅ **Solução:**
1. Verifique se está autenticado
2. Abra as Developer Tools do Expo e verifique os logs
3. Teste os endpoints diretamente no Swagger: `http://localhost:8080/swagger-ui.html`

### **App não conecta em dispositivo físico**
✅ **Solução:**
1. Certifique-se de que celular e computador estão na mesma rede Wi-Fi
2. Edite `src/config/api.js` e substitua `localhost` pelo IP da máquina
3. Desabilite firewall temporariamente para teste
4. Verifique se as portas 8080 e 3000 estão abertas

---

## 🧪 **Testando a Aplicação**

### **Fluxo Completo de Teste**

1. **Registrar Usuário**
   - Abra o app
   - Clique em "Cadastre-se"
   - Preencha usuário e senha (mínimo 6 caracteres)
   - Clique em "Cadastrar"

2. **Criar Categoria**
   - Na aba "Categorias", clique em "+ Nova Categoria"
   - Nome: "Alimentação"
   - Ícone: "🍔"
   - Meta Mensal: 500.00
   - Clique em "Criar Categoria"

3. **Adicionar Gasto**
   - Clique na categoria criada
   - Clique em "+ Adicionar" (ou vá na aba "Gastos")
   - Nome: "Almoço"
   - Valor: 25.00
   - Categoria: "Alimentação"
   - Clique em "Salvar Gasto"

4. **Visualizar Progresso**
   - Volte para a categoria
   - Veja a barra de progresso: R$ 25.00 / R$ 500.00 (5%)

---

## 📊 **Próximas Melhorias**

### **Funcionalidades**
- [ ] Gráficos de gastos por categoria (react-native-chart-kit)
- [ ] Filtros por período (mês/ano)
- [ ] Exportação de relatórios (CSV/PDF)
- [ ] Notificações push quando exceder meta
- [ ] Dark mode
- [ ] Foto de recibo/comprovante

### **Técnicas**
- [ ] Testes unitários (Jest)
- [ ] Testes E2E (Detox)
- [ ] Cache offline (AsyncStorage)
- [ ] Sincronização offline-first
- [ ] Internacionalização (i18n)
- [ ] Analytics (Firebase Analytics)

---

## 📝 **Licença**

Este projeto é parte do sistema **Controle de Gastos** e está integrado com:
- Backend Spring Boot (Java 21)
- Microserviço Auth (Node.js)
- MongoDB Atlas

---

## 👨‍💻 **Desenvolvido por**

**Principal Software Engineer**  
Especialista em arquitetura de APIs e desenvolvimento mobile

---

## 📞 **Suporte**

Em caso de dúvidas:
1. Verifique a documentação do backend: `controle-gastos-api/README.md`
2. Consulte o guia de API: `controle-gastos-api/GUIA_API.md`
3. Teste endpoints no Swagger: `http://localhost:8080/swagger-ui.html`

---

**🚀 Pronto para usar! O app está 100% integrado com o backend Spring Boot.**
