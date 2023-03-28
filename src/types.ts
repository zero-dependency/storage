export type ExcludeFunction<T> = T extends Function ? never : T

export interface StorageOptions {
  encode: Encode
  decode: Decode
}

export type Encode = (value: any) => string
export type Decode = (value: string) => any
