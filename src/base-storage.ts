import type { Decode, Encode, StorageOptions } from './types.js'

export class BaseStorage<T> {
  private readonly encode: Encode
  private readonly decode: Decode

  constructor(
    private readonly key: string,
    public readonly initialValue: T,
    private readonly storage: Storage,
    options?: StorageOptions
  ) {
    this.encode = (value) => {
      return options?.encode ? options.encode(value) : JSON.stringify(value)
    }

    this.decode = (value) => {
      return options?.decode ? options.decode(value) : JSON.parse(value)
    }

    if (!this.exists()) {
      this.write(this.initialValue)
    }
  }

  get values(): T {
    try {
      const value = this.storage.getItem(this.key)
      return value ? this.decode(value) : this.initialValue
    } catch {
      return this.initialValue
    }
  }

  write(value: T): T
  write(value: (prevValue: T) => T): T
  write(value: T | ((prevValue: T) => T)): T {
    if (value instanceof Function) {
      value = value(this.values)
    }

    try {
      this.storage.setItem(this.key, this.encode(value))
    } catch (err) {
      console.error(
        `Failed to save (${this.key}):`,
        (err as DOMException).message
      )
      return this.initialValue
    }

    return value
  }

  exists(): boolean {
    return this.storage.getItem(this.key) !== null
  }

  reset(): void {
    this.write(this.initialValue)
  }
}
