<div style="text-align: center;" align="center">

# userdir

一个简单的跨平台获取用户主目录的工具

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![License][license-image]][license-url]

</div>

<div style="text-align: center; margin-bottom: 20px;" align="center">

### **[更新日志](./CHANGELOG.md)** · **[English](./README.md)**

</div>

## 安装

```bash
# use pnpm
$ pnpm install userdir

# use npm
$ npm install userdir

# use yarn
$ yarn add userdir
```

## 环境要求

- Node.js >= 18

## 使用

### 基本用法

```js
import userdir from 'userdir'

userdir() // /Users/username
```

### 使用选项

```js
import { userdir, userdirAsync, clearCache } from 'userdir'

// 路径验证
userdir({ validate: true }) // 路径不存在则返回 null

// 禁用缓存
userdir({ cache: false })

// 异步版本
await userdirAsync()

// 清除缓存
clearCache()
```

### 选项

```typescript
interface UserdirOptions {
  /** 是否使用缓存（默认：true） */
  cache?: boolean
  /** 自定义环境变量（用于测试） */
  env?: typeof process.env
  /** 验证目录是否存在（默认：false） */
  validate?: boolean
}
```

## API

### `userdir(options?)`

同步获取用户主目录。

- **返回值**: `string | null` - 用户主目录路径，未找到则返回 null

### `userdirAsync(options?)`

异步获取用户主目录。

- **返回值**: `Promise<string | null>`

### `clearCache()`

清除内部缓存。

### 默认导出

默认导出优先使用 `os.homedir()`，不可用时回退到 `userdir()`。

## 从 v1.0 迁移到 v1.1

### Node.js 版本

v1.1 需要 Node.js >= 18。如需支持旧版本，请使用 v1.0。

### 导入变化

默认导出行为不变。新增命名导出：

```js
// v1.0
import userdir from 'userdir'

// v1.1 - 和之前一样
import userdir from 'userdir'

// v1.1 - 新的命名导出
import { userdir, userdirAsync, clearCache } from 'userdir'
```

### 新功能

```js
// 路径验证（路径不存在返回 null）
userdir({ validate: true })

// 禁用缓存
userdir({ cache: false })

// 异步 API
await userdirAsync()

// 手动清除缓存
clearCache()
```

### 移除的依赖

v1.1 不再依赖 `core-js` 或 `js-cool`。如果你的项目依赖这些包，请直接安装。

### 构建输出

| v1.0 | v1.1 |
|------|------|
| `dist/index.mjs` | `dist/index.js` |
| `dist/index.cjs` | `dist/index.cjs` |

## 支持与问题

请在[这里](https://github.com/saqqdy/userdir/issues)提交问题。

## 许可证

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/userdir.svg?style=flat-square
[npm-url]: https://npmjs.org/package/userdir
[download-image]: https://img.shields.io/npm/dm/userdir.svg?style=flat-square
[download-url]: https://npmjs.org/package/userdir
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE
