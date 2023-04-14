import { WebStorage } from './web-storage.js'
import type { ExcludeFunction, StorageOptions } from './types.js'

export class LocalStorage<T> extends WebStorage<T> {
  constructor(
    key: string,
    value: ExcludeFunction<T>,
    options?: StorageOptions<T>
  ) {
    super(key, value, localStorage, options)
  }
}
