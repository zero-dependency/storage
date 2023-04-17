import type { Decode, Encode, StorageOptions } from './types.js'

export class WebStorage<T> {
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

    if (!this.has()) {
      this.write(this.#initialValue)
    }
  }

  /**
   * Get initial value of storage
   */
  get initialValue(): T {
    return this.#initialValue
  }

  /**
   * Read value from storage or return initial value if value does not exist in storage
   */
  get value(): T {
    try {
      const value = this.#storage.getItem(this.#key)
      return value ? this.#decode(value) : this.#initialValue
    } catch (err) {
      console.error(err)
      return this.#initialValue
    }
  }

  /**
   * Write value to storage and return the value written
   * @param value Value to write to storage
   */
  write(value: T): T
  write(value: (prevValue: T) => T): T
  write(value: T | ((prevValue: T) => T)): T {
    if (value instanceof Function) {
      value = value(this.value)
    }

    try {
      this.#storage.setItem(this.#key, this.#encode(value))
    } catch (err) {
      console.error(err)
      return this.#initialValue
    }

    return value
  }

  /**
   * Check if the value exists in storage
   * @returns true if the value exists in storage
   */
  has(): boolean {
    return this.#storage.getItem(this.#key) !== null
  }

  /**
   * Reset storage to initial value
   */
  reset(): void {
    this.write(this.#initialValue)
  }
}
