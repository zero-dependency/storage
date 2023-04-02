import type { Decode, Encode, StorageOptions } from './types.js'

export class BaseStorage<T> {
  #key: string
  #initialValue: T
  #encode: Encode<T>
  #decode: Decode<T>
  #storage: Storage

  constructor(
    key: string,
    initialValue: T,
    storage: Storage,
    options?: StorageOptions<T>
  ) {
    this.#key = key
    this.#initialValue = initialValue
    this.#storage = storage

    this.#encode = (value) => {
      return options?.encode ? options.encode(value) : JSON.stringify(value)
    }

    this.#decode = (value) => {
      return options?.decode ? options.decode(value) : JSON.parse(value)
    }

    if (!this.exists()) {
      this.write(this.#initialValue)
    }
  }

  get initialValue(): T {
    return this.#initialValue
  }

  get values(): T {
    try {
      const value = this.#storage.getItem(this.#key)
      return value ? this.#decode(value) : this.#initialValue
    } catch (err) {
      console.error(err)
      return this.#initialValue
    }
  }

  write(value: T): T
  write(value: (prevValue: T) => T): T
  write(value: T | ((prevValue: T) => T)): T {
    if (value instanceof Function) {
      value = value(this.values)
    }

    try {
      this.#storage.setItem(this.#key, this.#encode(value))
    } catch (err) {
      console.error(err)
      return this.#initialValue
    }

    return value
  }

  exists(): boolean {
    return this.#storage.getItem(this.#key) !== null
  }

  reset(): void {
    this.write(this.#initialValue)
  }
}
