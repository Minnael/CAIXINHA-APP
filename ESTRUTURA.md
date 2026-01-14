# 📂 Estrutura do Projeto

```
controle-gastos-app/
│
├── 📄 App.js                           # ⭐ Componente raiz (providers + navegação)
├── 📄 app.json                         # Configuração Expo
├── 📄 package.json                     # Dependências NPM
├── 📄 babel.config.js                  # Configuração Babel
├── 📄 .gitignore                       # Arquivos ignorados pelo Git
│
├── 📄 README.md                        # 📖 Documentação completa
├── 📄 QUICK_START.md                   # ⚡ Guia rápido de início
├── 📄 CONFIGURACAO.md                  # ⚙️ Como configurar URLs
├── 📄 ESTRUTURA.md                     # 📂 Este arquivo
│
└── src/
    │
    ├── 📁 config/
    │   └── api.js                      # 🔧 URLs base (ALTERE AQUI!)
    │
    ├── 📁 services/                    # 🌐 Integração com Backend
    │   ├── apiClient.js                # Axios + Interceptors (auto token)
    │   ├── storage.js                  # SecureStore (token/usuário)
    │   ├── authService.js              # Login/Registro (porta 3000)
    │   ├── categoriaService.js         # CRUD Categorias (porta 8080)
    │   └── gastoService.js             # CRUD Gastos (porta 8080)
    │
    ├── 📁 contexts/                    # 🔄 Estado Global (Context API)
    │   ├── AuthContext.js              # Autenticação (login/logout/user)
    │   ├── CategoriaContext.js         # Categorias (CRUD + cache local)
    │   └── GastoContext.js             # Gastos (CRUD + cache local)
    │
    ├── 📁 screens/                     # 📱 Telas do App
    │   │
    │   ├── 🔐 Autenticação
    │   ├── LoginScreen.js              # Tela de login
    │   └── RegisterScreen.js           # Tela de registro
    │   │
    │   ├── 📁 Categorias
    │   ├── CategoriasListScreen.js     # Lista de categorias + progresso
    │   ├── CategoriaFormScreen.js      # Criar/Editar categoria
    │   └── CategoriaDetalhesScreen.js  # Detalhes + lista de gastos
    │   │
    │   └── 💰 Gastos
    │       ├── GastosListScreen.js     # Lista de todos os gastos
    │       └── GastoFormScreen.js      # Criar novo gasto
    │
    ├── 📁 components/                  # 🧩 Componentes Reutilizáveis
    │   ├── Button.js                   # Botão customizado (4 variantes)
    │   ├── Input.js                    # Input customizado (validação visual)
    │   ├── Loading.js                  # Indicador de carregamento
    │   └── ErrorMessage.js             # Banner de erro
    │
    ├── 📁 navigation/                  # 🧭 Configuração de Navegação
    │   └── AppNavigator.js             # AuthStack + MainTabs (Categorias/Gastos)
    │
    └── 📁 styles/                      # 🎨 Design System
        └── theme.js                    # Cores, espaçamentos, sombras
```

---

## 🎯 Arquivos Principais

### **Você vai mexer mais nestes:**

1. **`src/config/api.js`** ⭐  
   → Alterar URLs quando testar em dispositivo físico

2. **`src/screens/*`**  
   → Telas do aplicativo (UI/UX)

3. **`src/services/*`**  
   → Lógica de integração com backend

4. **`src/contexts/*`**  
   → Estado global da aplicação

---

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Screen    │  (Tela exibe dados)
└──────┬──────┘
       │
       ↓ usa hook
┌─────────────┐
│   Context   │  (Estado global)
└──────┬──────┘
       │
       ↓ chama
┌─────────────┐
│   Service   │  (Integração API)
└──────┬──────┘
       │
       ↓ usa
┌─────────────┐
│  apiClient  │  (Axios + Token)
└──────┬──────┘
       │
       ↓ HTTP
┌─────────────┐
│   Backend   │  (Spring Boot)
└─────────────┘
```

---

## 📊 Exemplo de Uso

```javascript
// 1. Screen importa Context
import { useCategorias } from '../contexts/CategoriaContext';

function MinhaScreen() {
  // 2. Usa hook do Context
  const { categorias, carregarCategorias } = useCategorias();
  
  useEffect(() => {
    // 3. Context chama Service
    carregarCategorias(); // → CategoriaService.listarTodas()
  }, []);
  
  // 4. Renderiza dados
  return <FlatList data={categorias} />;
}
```

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Framework | Expo 50 + React Native |
| Navegação | React Navigation 6 |
| HTTP Client | Axios |
| Estado Global | Context API |
| Armazenamento | Expo SecureStore |
| UI Components | Custom (Button, Input, Loading) |
| Validação | Bean Validation (client-side) |

---

## 🎨 Design System

**Cores Principais:**
- Primary: `#6366f1` (Indigo)
- Secondary: `#10b981` (Green)
- Error: `#ef4444` (Red)

**Componentes:**
- Button (4 variantes)
- Input (com validação)
- Loading (centralizado)
- ErrorMessage (banner)

---

## 🔐 Autenticação

```
Login → Token JWT → SecureStore → apiClient Interceptor → Headers
```

Todas as requisições para `/api/*` incluem automaticamente:
```
Authorization: Bearer <token>
```

---

## 📱 Navegação

```
App.js
  └── AppNavigator
      ├── AuthStack (não autenticado)
      │   ├── Login
      │   └── Register
      │
      └── MainTabs (autenticado)
          ├── CategoriasTab
          │   ├── CategoriasList
          │   ├── CategoriaForm
          │   └── CategoriaDetalhes
          │
          └── GastosTab
              ├── GastosList
              └── GastoForm
```

---

**🚀 Agora você conhece toda a estrutura do projeto!**
