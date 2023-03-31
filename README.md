# @zero-dependency/storage

[![npm version](https://img.shields.io/npm/v/@zero-dependency/storage)](https://npm.im/@zero-dependency/storage)
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@zero-dependency/storage)](https://bundlephobia.com/package/@zero-dependency/storage@latest)
![npm license](https://img.shields.io/npm/l/@zero-dependency/storage)

## Installation

```sh
npm install @zero-dependency/storage
```

```sh
yarn add @zero-dependency/storage
```

```sh
pnpm add @zero-dependency/storage
```

## Usage

```ts
import { LocalStorage } from '@zero-dependency/storage'

interface User {
  id: number
  name: string
}

const storageKey = 'users'
const storage = new LocalStorage<User[]>(storageKey, [])
console.log(storage.initialValue) // []

storage.write((prevValues) => [...prevValues, { id: 1, name: 'John' }])
console.log(storage.values) // [{ id: 1, name: 'John' }]

storage.reset()
console.log(storage.values) // []

// https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event#examples
window.addEventListener('storage', (event) => {
  if (event.key === storageKey) {
    // do something
  }
})
```
