# 🎨 Design System - Caixinha App

## Visão Geral

O app Caixinha foi modernizado com um design system completo, focado em criar uma experiência visual atraente, moderna e consistente.

## 🎨 Paleta de Cores

### Cores Principais
- **Primary**: `#7C3AED` (Violet 600) - Cor principal do app
- **Primary Dark**: `#5B21B6` (Violet 800) - Versão mais escura
- **Primary Light**: `#A78BFA` (Violet 400) - Versão mais clara

### Cores Secundárias
- **Secondary**: `#10B981` (Emerald 500) - Verde menta para valores e sucesso
- **Accent**: `#F59E0B` (Amber 500) - Cor de destaque

### Estados
- **Success**: Verde para operações bem-sucedidas
- **Warning**: Âmbar para avisos
- **Error**: Vermelho para erros
- **Info**: Azul para informações

### Gradientes
- **Primary Gradient**: Roxo → Violeta → Azul
- **Secondary Gradient**: Verde → Verde escuro
- **Sunset**: Âmbar → Vermelho → Rosa

## 📏 Espaçamento

```javascript
spacing: {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
}
```

## 🔲 Border Radius

```javascript
borderRadius: {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
}
```

## 🌟 Componentes Atualizados

### Button
- **Variantes**: `primary`, `secondary`, `outline`, `danger`, `ghost`
- **Tamanhos**: `small`, `medium`, `large`
- **Features**:
  - Gradientes em botões primários e secundários
  - Sombras suaves
  - Estados de loading e disabled
  - Suporte a ícones

### Input
- **Features**:
  - Bordas arredondadas maiores (16px)
  - Altura mínima de 56px para melhor touch target
  - Feedback visual ao focar (borda azul + sombra)
  - Background colorido em caso de erro
  - Ícones à esquerda e direita

### Card
- **Novo componente reutilizável**
- **Variantes**: `default`, `elevated`, `outlined`
- **Features**:
  - Suporte a gradientes
  - Sombras configuráveis
  - Border radius grande (20px)

## 🎭 Telas Atualizadas

### Login Screen
- Header com gradiente roxo/azul
- Emoji decorativo (💰)
- Espaçamento generoso
- Inputs modernos

### Gastos List Screen
- Header com gradiente e total destacado
- Cards com gradiente sutil
- Tags de categoria coloridas
- Valores em destaque com background
- Botão de delete estilizado

### Categorias List Screen
- Header com gradiente
- Cards com borda colorida à esquerda
- Progress bar aprimorada (10px de altura)
- Valores em containers com background
- Ícones grandes (32px)

## 🎯 Sombras

```javascript
shadows: {
  sm: elevation 2 - Para elementos sutis
  md: elevation 4 - Para cards e botões
  lg: elevation 8 - Para elementos importantes
  xl: elevation 12 - Para modals e overlays
  colored: Sombra roxa para destaque especial
}
```

## 📱 Princípios de Design

1. **Hierarquia Visual Clara**: Uso de tamanhos, cores e espaçamento para criar foco
2. **Consistência**: Mesmo estilo aplicado em todo o app
3. **Acessibilidade**: Touch targets mínimos de 48px
4. **Feedback Visual**: Estados hover, focus, pressed claramente visíveis
5. **Gradientes Sutis**: Usado para adicionar profundidade sem sobrecarregar
6. **Espaçamento Generoso**: Breathing room entre elementos
7. **Tipografia Legível**: Pesos e tamanhos variados para hierarquia

## 🚀 Como Usar

### Importar o tema
```javascript
import theme from '../styles/theme';
```

### Usar cores
```javascript
backgroundColor: theme.colors.primary
color: theme.colors.textSecondary
```

### Usar gradientes
```javascript
<LinearGradient
  colors={theme.gradients.primary}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  {/* conteúdo */}
</LinearGradient>
```

### Usar sombras
```javascript
...theme.shadows.md
```

### Usar espaçamento
```javascript
padding: theme.spacing.lg
margin: theme.spacing.md
```

## 📦 Dependências Necessárias

```json
{
  "expo-linear-gradient": "~12.7.2"
}
```

## 🔄 Instalação

Para instalar as novas dependências:

```bash
npm install
```

ou

```bash
yarn install
```

## ✨ Melhorias Futuras

- [ ] Modo escuro (dark mode)
- [ ] Animações de transição
- [ ] Skeletons para loading states
- [ ] Micro-interações
- [ ] Haptic feedback
- [ ] Temas customizáveis

---

**Design atualizado em**: Janeiro 2026
**Versão**: 2.0
