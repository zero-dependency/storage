export type ExcludeFunction<T> = T extends Function ? never : T

export interface StorageOptions {
  serialize: Serialize
  deserialize: Deserialize
}

export type Serialize = (value: any) => string
export type Deserialize = (value: string) => any
