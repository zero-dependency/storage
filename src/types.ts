export type ExcludeFunction<T> = T extends Function ? never : T

export interface StorageOptions<T> {
  encode: Encode<T>
  decode: Decode<T>
}

export type Encode<T> = (value: T) => string
export type Decode<T> = (value: string) => T
