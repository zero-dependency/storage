import { BaseStorage } from './base-storage.js'
import type { ExcludeFunction, StorageOptions } from './types.js'

export class LocalStorage<T> extends BaseStorage<T> {
  constructor(key: string, value: ExcludeFunction<T>, options?: StorageOptions) {
    super(key, value, localStorage, options)
  }
}

export class SessionStorage<T> extends BaseStorage<T> {
  constructor(key: string, value: ExcludeFunction<T>, options?: StorageOptions) {
    super(key, value, sessionStorage, options)
  }
}
