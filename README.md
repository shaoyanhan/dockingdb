# DockingDB

A web application for exploring and visualizing molecular docking information. DockingDB provides an interactive interface to explore the docking information of plant hormone molecules with protein receptors, view molecular structures, and retrieve relevant research data.

## Features

- **Molecular Browsing**: Browse various plant hormone molecules, including cytokinins, auxins, brassinosteroids, etc.
- **Molecular Structure Visualization**: View 3D molecular structures using MolStar.
- **Docking Data Search**: Search for molecular docking data and sort by docking scores.
- **Data Download**: Download molecular structures and docking data.
- **Links to Relevant Research Papers**: Direct links to relevant research papers.

## Technology Stack

- **Frontend Framework**: React 19
- **Routing**: React Router 7
- **Styling**: Tailwind CSS
- **Table**: TanStack Table v8
- **Molecular Visualization**: MolStar
- **Build Tool**: Vite
- **Language**: TypeScript

## Installation and Running

### Prerequisites

- Node.js (version v18.0.0 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/dockingdb.git
   cd dockingdb
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Build the production version

   ```bash
   npm run build
   # or
   yarn build
   ```

5. Preview the build result

   ```bash
   npm run preview
   # or
   yarn preview
   ```

## Project Structure

```
dockingdb/
├── public/              # Static resources
├── src/                 # Source code
│   ├── assets/          # Images and other resources
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.ts       # Vite configuration
```

## User Guide

### Browsing Molecules

Select a molecular category from the homepage. For certain categories (e.g., cytokinins), you can also choose to view secondary molecular classifications.

### Searching

Use the global search function to search for specific molecules or protein structures.

### Viewing Molecular Structures

Select a molecule on the molecular table page to view its 3D structure and related docking information.

### Downloading Data

Use the download button on the download page or molecular structure page to download molecular structure files and docking data.

## Contribution Guidelines

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Create a Pull Request.

## License

[MIT License](LICENSE)

## Contact Information

If you have any questions or suggestions, please contact us through the following methods:

- Email: 1740569155@qq.com
- Project Issues: [GitHub Issues](https://github.com/yourusername/dockingdb/issues)

---

### Note on Web Links

Due to network issues, the provided web links may not be successfully parsed. If you need to access these links, please ensure their validity and try again. If the issue persists, it might be related to the link itself or your network connection.

# DockingDB

一个用于探索和可视化分子对接信息的 web 应用程序。DockingDB 提供了一个交互式界面，用于探索植物激素分子与蛋白质受体的对接信息，查看分子结构，并检索相关研究数据。

## 功能特点

- **分子浏览**：浏览各类植物激素分子，包括细胞分裂素、生长素、油菜素内酯等
- **分子结构可视化**：使用 MolStar 查看分子 3D 结构
- **对接数据搜索**：搜索分子对接数据，并按照对接评分进行排序
- **数据下载**：下载分子结构和对接数据
- **相关研究论文链接**：直接链接到相关研究论文

## 技术栈

- **前端框架**：React 19
- **路由**：React Router 7
- **样式**：Tailwind CSS
- **表格**：TanStack Table v8
- **分子可视化**：MolStar
- **构建工具**：Vite
- **语言**：TypeScript

## 安装与运行

### 前提条件

- Node.js (v18.0.0 或更高版本)
- npm 或 yarn

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/dockingdb.git
cd dockingdb
```

2. 安装依赖

```bash
npm install
# 或者
yarn install
```

3. 启动开发服务器

```bash
npm run dev
# 或者
yarn dev
```

4. 构建生产版本

```bash
npm run build
# 或者
yarn build
```

5. 预览构建结果

```bash
npm run preview
# 或者
yarn preview
```

## 项目结构

```
dockingdb/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── assets/          # 图片和其他资源
│   ├── components/      # 可复用组件
│   ├── pages/           # 页面组件
│   ├── App.tsx          # 应用主组件
│   └── main.tsx         # 应用入口
├── index.html           # HTML模板
├── package.json         # 依赖和脚本
└── vite.config.ts       # Vite配置
```

## 使用指南

### 浏览分子

从主页上选择一个分子类别。对于某些类别（如细胞分裂素），还可以选择查看二级分子分类。

### 搜索

使用全局搜索功能搜索特定分子或蛋白质结构。

### 查看分子结构

在分子表格页面中选择一个分子，以查看其 3D 结构及相关对接信息。

### 下载数据

在下载页面或分子结构页面上使用下载按钮下载分子结构文件和对接数据。

## 贡献指南

欢迎贡献！请按照以下步骤进行：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

如有问题或建议，请通过以下方式联系我们：

- 电子邮件：1740569155@qq.com
- 项目 Issues：[GitHub Issues](https://github.com/yourusername/dockingdb/issues)
