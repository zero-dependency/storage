import type { StorageOptions, Deserialize, Serialize } from "./types"

export class BaseStorage<T> {
  private readonly serialize: Serialize
  private readonly deserialize: Deserialize

  constructor(
    private readonly key: string,
    public readonly initialValue: T,
    private readonly storage: Storage,
    options?: StorageOptions
  ) {
    this.serialize = (value) => {
      return options?.serialize
        ? options.serialize(value)
        : JSON.stringify(value)
    }

    this.deserialize = (value) => {
      return options?.deserialize
        ? options.deserialize(value)
        : JSON.parse(value)
    }
  }

  get values(): T {
    try {
      const value = this.storage.getItem(this.key)
      return value ? this.deserialize(value) : this.initialValue
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
      this.storage.setItem(this.key, this.serialize(value))
    } catch (err) {
      console.error(
        `Failed to save (${this.key}):`,
        (err as DOMException).message
      )
      return this.initialValue
    }

    return value
  }

  reset(): void {
    this.write(this.initialValue)
  }
}
