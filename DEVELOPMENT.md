# DockingDB Development Documentation

This document provides detailed technical information about the DockingDB project, including architecture design, component structure, development environment setup, and development workflow.

## Project Architecture

DockingDB is a Single Page Application (SPA) built with React and TypeScript, utilizing Vite as the build tool. The project adheres to a component-based development philosophy and employs routing for page navigation.

### Core Technology Stack

- **Frontend Framework**: React 19
- **Routing Management**: React Router 7
- **Styling**: Tailwind CSS
- **Table Handling**: TanStack Table v8
- **Molecular Visualization**: MolStar
- **Build Tool**: Vite
- **Development Language**: TypeScript

### Directory Structure Breakdown

```plaintext
dockingdb/
├── public/                    # Static resources
│   └── vite.svg              # Vite logo
├── src/                       # Source code
│   ├── assets/                # Resource files
│   │   ├── images/           # Image resources
│   ├── components/            # General components
│   │   ├── ContactModal.tsx  # Contact us modal
│   │   ├── Footer.tsx        # Footer component
│   │   ├── Header.tsx        # Header component
│   │   ├── MoleculeCard.tsx  # Molecule card component
│   │   ├── MolstarViewer.tsx # Molecular structure viewer
│   │   └── SearchBar.tsx     # Search bar component
│   ├── pages/                 # Page components
│   │   ├── DownloadPage.tsx  # Download page
│   │   ├── GlobalSearchPage.tsx # Global search page
│   │   ├── HomePage.tsx      # Home page
│   │   ├── MoleculeStructurePage.tsx # Molecular structure page
│   │   └── MoleculeTablePage.tsx # Molecule table page
│   ├── App.tsx                # Application root component and routing configuration
│   ├── index.css              # Global CSS
│   ├── main.tsx               # Application entry point
│   └── vite-env.d.ts         # Vite environment type declaration
├── index.html                 # HTML template
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json          # Application TypeScript configuration
├── tsconfig.node.json         # Node TypeScript configuration
├── vite.config.ts             # Vite configuration
├── tailwind.config.cjs        # Tailwind CSS configuration
├── postcss.config.cjs         # PostCSS configuration
└── eslint.config.js           # ESLint configuration
```

## Component Design

### Page Components

1. **HomePage.tsx**

   - **Functionality**: Displays primary molecular categories and secondary molecular categories.
   - **State Management**: Utilizes React state management for different view modes.
   - **Component Interaction**: Interacts with the `MoleculeCard` component to display molecular information.

2. **MoleculeTablePage.tsx**

   - **Functionality**: Displays docking data tables for specific molecules.
   - **Data Handling**: Uses TanStack Table for table rendering and management.
   - **Features**: Supports pagination, filtering, sorting, and custom pagination navigation.

3. **MoleculeStructurePage.tsx**

   - **Functionality**: Displays 3D molecular structures and detailed docking information.
   - **Integration**: Integrates MolStar for 3D molecular visualization.
   - **Features**: Supports full-screen mode and data download.

4. **GlobalSearchPage.tsx**

   - **Functionality**: Provides a global search feature to retrieve molecules and structures.
   - **Search Logic**: Implements complex search filtering and result display.

5. **DownloadPage.tsx**
   - **Functionality**: Offers various data download options.
   - **Features**: Includes data filtering and options to download in multiple formats.

### General Components

1. **Header.tsx**

   - **Purpose**: Application top navigation bar.
   - **Functionality**: Provides website title and navigation links.

2. **Footer.tsx**

   - **Purpose**: Page bottom information bar.
   - **Content**: Includes contact information, copyright notices, etc.

3. **SearchBar.tsx**

   - **Purpose**: Search input and processing.
   - **Functionality**: Receives user input and triggers search.

4. **MoleculeCard.tsx**

   - **Purpose**: Molecular information display card.
   - **Functionality**: Displays molecular images and basic information.

5. **MolstarViewer.tsx**

   - **Purpose**: 3D molecular structure visualization.
   - **Integration**: Encapsulates the functionality of the MolStar library.

6. **ContactModal.tsx**
   - **Purpose**: Contact form modal window.
   - **Functionality**: Collects and processes user feedback.

## Data Flow

### Data Acquisition

1. Molecular structure data is obtained from the API in PDB or MOL2 format.
2. Docking data is obtained from the API, including scores and various energy parameters.
3. The `fetch` API is used for asynchronous data requests.

### Data Display Process

1. Users select molecular categories on the home page.
2. The system loads the docking data table for the selected molecule.
3. Users choose a specific docking result to view its 3D structure.
4. The MolStar component loads and renders the molecular structure.
5. The page simultaneously displays relevant docking parameters and research information.

## Development Environment Setup

### Required Software

- Node.js (v18.0.0+)
- npm or yarn
- Modern browser (Chrome, Firefox, Edge, etc.)
- Code editor (VSCode recommended)

### Development Environment Configuration

1. Install Node.js and npm.
2. Clone the project repository: `git clone https://github.com/yourusername/dockingdb.git` (Note: If you encounter issues with this link, please check the validity of the URL and try again).
3. Install dependencies: `npm install` or `yarn install`.
4. Start the development server: `npm run dev` or `yarn dev`.
5. Access in the browser: `http://localhost:5173`.

### Recommended VSCode Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Error Lens

## Development Workflow

### Branch Strategy

- `main`: Main branch containing production-ready code.
- `develop`: Development branch containing the latest development code.
- `feature/*`: Feature branches for developing new functionalities.
- `bugfix/*`: Branches for bug fixes.
- `release/*`: Branches for release preparation.

### Developing New Features

1. Create a new feature branch from the `develop` branch: `git checkout -b feature/new-feature develop`.
2. Develop and test the new feature.
3. Commit changes: `git commit -m "feat: add new feature"`.
4. Push the branch to the remote repository: `git push origin feature/new-feature`.
5. Create a Pull Request to the `develop` branch.

### Code Standards

- Use ESLint for code quality checks.
- Follow TypeScript type safety principles.
- Use PascalCase for component naming (e.g., `SearchBar`).
- Use camelCase for function and variable naming (e.g., `handleSearch`).
- Utilize functional components and React Hooks; avoid class components.

### Commit Conventions

Follow the Angular-style commit message format:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting adjustments
- `refactor`: Code refactoring
- `test`: Testing-related changes
- `chore`: Changes to build process or auxiliary tools

Example: `feat: add molecule comparison feature`

## Testing Strategy

1. **Unit Testing**: Use Jest to test individual functionalities and components.
2. **Integration Testing**: Test interactions between components.
3. **End-to-End (E2E) Testing**: Use Cypress for end-to-end testing.
4. **Performance Testing**: Monitor performance for large 3D molecular rendering.

## Deployment Process

1. Run production build: `npm run build` or `yarn build`.
2. Test build output: `npm run preview` or `yarn preview`.
3. Deploy the `dist` directory to a web server.
4. Configure the server to handle SPA routing (all paths should point to `index.html`).

## API Documentation

### Retrieving Molecular Docking Data

```plaintext
GET /api/molecules/{moleculeName}/dockings
```

Parameters:

- `moleculeName`: Name of the molecule

Response:

```json
{
  "total": number,
  "rows": [
    {
      "rank": number,
      "pocketId": string,
      "gridScore": string,
      "structTitle": string,
      "pdbId": string,
      "paperTitle": string,
      "paperLink": string
    }
  ]
}
```

### Retrieving Molecular Structure Data

```plaintext
GET /api/molecules/{moleculeName}/pockets/{pocketId}/mol2
```

Parameters:

- `moleculeName`: Name of the molecule
- `pocketId`: Pocket ID

Response: Molecular structure data in MOL2 format.

## Troubleshooting

### Common Issues

1. **3D Molecular Rendering Issues**: Ensure WebGL is enabled and check browser compatibility.
2. **API Connection Failures**: Check network connectivity and API

# DockingDB 开发文档

本文档提供了 DockingDB 项目的详细技术信息，包括架构设计、组件结构、开发环境设置以及开发工作流程。

## 项目架构

DockingDB 是一个基于 React 和 TypeScript 的单页应用（SPA），使用 Vite 作为构建工具。项目遵循组件化的开发思想，并采用路由进行页面导航。

### 核心技术栈

- **前端框架**: React 19
- **路由管理**: React Router 7
- **样式处理**: Tailwind CSS
- **表格处理**: TanStack Table v8
- **分子可视化**: MolStar
- **构建工具**: Vite
- **开发语言**: TypeScript

### 目录结构详解

```
dockingdb/
├── public/                    # 静态资源
│   └── vite.svg              # Vite图标
├── src/                       # 源代码
│   ├── assets/                # 资源文件
│   │   ├── images/           # 图片资源
│   ├── components/            # 通用组件
│   │   ├── ContactModal.tsx  # 联系我们模态框
│   │   ├── Footer.tsx        # 页脚组件
│   │   ├── Header.tsx        # 页头组件
│   │   ├── MoleculeCard.tsx  # 分子卡片组件
│   │   ├── MolstarViewer.tsx # 分子结构查看器
│   │   └── SearchBar.tsx     # 搜索栏组件
│   ├── pages/                 # 页面组件
│   │   ├── DownloadPage.tsx  # 下载页面
│   │   ├── GlobalSearchPage.tsx # 全局搜索页面
│   │   ├── HomePage.tsx      # 首页
│   │   ├── MoleculeStructurePage.tsx # 分子结构页面
│   │   └── MoleculeTablePage.tsx # 分子表格页面
│   ├── App.tsx                # 应用根组件和路由配置
│   ├── index.css              # 全局CSS
│   ├── main.tsx               # 应用入口
│   └── vite-env.d.ts         # Vite环境类型声明
├── index.html                 # HTML模板
├── package.json               # 项目依赖和脚本
├── tsconfig.json              # TypeScript配置
├── tsconfig.app.json          # 应用TypeScript配置
├── tsconfig.node.json         # 节点TypeScript配置
├── vite.config.ts             # Vite配置
├── tailwind.config.cjs        # Tailwind CSS配置
├── postcss.config.cjs         # PostCSS配置
└── eslint.config.js           # ESLint配置
```

## 组件设计

### 页面组件 (Pages)

1. **HomePage.tsx**

   - 功能：展示主要分子类别和二级分子类别
   - 状态管理：使用 React 状态管理不同视图模式
   - 组件交互：与 MoleculeCard 组件交互显示分子信息

2. **MoleculeTablePage.tsx**

   - 功能：展示特定分子的对接数据表格
   - 数据处理：使用 TanStack Table 进行表格渲染和管理
   - 特性：支持分页、筛选、排序和自定义页码导航

3. **MoleculeStructurePage.tsx**

   - 功能：展示分子 3D 结构和详细对接信息
   - 集成：集成 MolStar 进行 3D 分子可视化
   - 特性：支持全屏模式和数据下载

4. **GlobalSearchPage.tsx**

   - 功能：提供全局搜索功能，检索分子和结构
   - 搜索逻辑：实现复杂的搜索过滤和结果展示

5. **DownloadPage.tsx**
   - 功能：提供各种数据下载选项
   - 功能：包含数据筛选和下载多种格式的选项

### 通用组件 (Components)

1. **Header.tsx**

   - 用途：应用顶部导航栏
   - 功能：提供网站标题和导航链接

2. **Footer.tsx**

   - 用途：页面底部信息栏
   - 内容：包含联系信息、版权声明等

3. **SearchBar.tsx**

   - 用途：搜索输入和处理
   - 功能：接收用户输入并触发搜索

4. **MoleculeCard.tsx**

   - 用途：分子信息展示卡
   - 功能：展示分子图片和基本信息

5. **MolstarViewer.tsx**

   - 用途：分子 3D 结构可视化
   - 集成：封装 MolStar 库功能

6. **ContactModal.tsx**
   - 用途：联系表单模态窗口
   - 功能：收集并处理用户反馈

## 数据流程

### 数据获取

1. 分子结构数据从 API 获取，格式为 PDB 或 MOL2
2. 对接数据从 API 获取，包含评分和各种能量参数
3. 使用 fetch API 进行异步数据请求

### 数据展示流程

1. 用户在首页选择分子类别
2. 系统加载该分子的对接数据表格
3. 用户选择特定的对接结果查看 3D 结构
4. MolStar 组件加载并渲染分子结构
5. 页面同时展示相关对接参数和研究信息

## 开发环境设置

### 必要软件

- Node.js (v18.0.0+)
- npm 或 yarn
- 现代浏览器 (Chrome、Firefox、Edge 等)
- 代码编辑器 (推荐 VSCode)

### 开发环境配置

1. 安装 Node.js 和 npm
2. 克隆项目仓库：`git clone https://github.com/yourusername/dockingdb.git`
3. 安装依赖：`npm install` 或 `yarn install`
4. 启动开发服务器：`npm run dev` 或 `yarn dev`
5. 在浏览器中访问：`http://localhost:5173`

### VSCode 推荐扩展

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Error Lens

## 开发工作流程

### 分支策略

- `main`: 主分支，包含生产就绪代码
- `develop`: 开发分支，包含最新开发代码
- `feature/*`: 功能分支，用于开发新功能
- `bugfix/*`: 错误修复分支
- `release/*`: 发布准备分支

### 开发新功能

1. 从`develop`分支创建一个新的功能分支：`git checkout -b feature/new-feature develop`
2. 开发并测试新功能
3. 提交更改：`git commit -m "feat: add new feature"`
4. 将分支推送到远程：`git push origin feature/new-feature`
5. 创建 Pull Request 至`develop`分支

### 代码规范

- 使用 ESLint 进行代码质量检查
- 遵循 TypeScript 类型安全原则
- 组件命名使用 PascalCase（如`SearchBar`）
- 函数和变量命名使用 camelCase（如`handleSearch`）
- 使用函数组件和 React Hooks，避免使用类组件

### 提交规范

遵循 Angular 风格的提交消息格式：

- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更改
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：`feat: add molecule comparison feature`

## 测试策略

1. **单元测试**: 使用 Jest 测试独立功能和组件
2. **集成测试**: 测试组件之间的交互
3. **E2E 测试**: 使用 Cypress 进行端到端测试
4. **性能测试**: 监控大型 3D 分子渲染性能

## 部署流程

1. 运行生产构建：`npm run build` 或 `yarn build`
2. 测试构建输出：`npm run preview` 或 `yarn preview`
3. 将`dist`目录部署到 Web 服务器
4. 配置服务器处理 SPA 路由（所有路径均指向 index.html）

## API 文档

### 获取分子对接数据

```
GET /api/molecules/{moleculeName}/dockings
```

参数：

- `moleculeName`: 分子名称

返回：

```json
{
  "total": number,
  "rows": [
    {
      "rank": number,
      "pocketId": string,
      "gridScore": string,
      "structTitle": string,
      "pdbId": string,
      "paperTitle": string,
      "paperLink": string
    }
  ]
}
```

### 获取分子结构数据

```
GET /api/molecules/{moleculeName}/pockets/{pocketId}/mol2
```

参数：

- `moleculeName`: 分子名称
- `pocketId`: 口袋 ID

返回：MOL2 格式的分子结构数据

## 故障排除

### 常见问题

1. **3D 分子渲染问题**: 确保 WebGL 已启用，检查浏览器兼容性
2. **API 连接失败**: 检查网络连接和 API 端点配置
3. **表格分页错误**: 清除浏览器缓存并刷新页面

### 调试技巧

1. 使用浏览器开发者工具检查网络请求
2. 在关键组件中添加 console.log 进行调试
3. 使用 React DevTools 检查组件状态和结构

## 未来计划

1. 添加用户账户系统
2. 实现分子对比功能
3. 添加批量下载功能
4. 优化移动设备的用户体验
5. 集成更多分子分析工具

---

_最后更新于：2025 年 3 月 8 日_
