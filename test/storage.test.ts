import { describe, expect, expectTypeOf } from 'vitest'
import { LocalStorage, SessionStorage } from '../src/index.js'

interface User {
  id: number
  name: string
}

function getUser(id: number): User {
  return {
    id,
    name: 'John'
  }
}

describe('LocalStorage/SessionStorage', (test) => {
  test('should be defined', () => {
    expect(LocalStorage).toBeDefined()
    expect(SessionStorage).toBeDefined()

    const localStorage = new LocalStorage('test', '')
    expect(localStorage).toBeDefined()

    const sessionStorage = new SessionStorage('test', '')
    expect(sessionStorage).toBeDefined()
  })

  test('should be able to write and retrieve a value', () => {
    const storage = new LocalStorage('test0', 1)
    expect(storage.values).toEqual(1)
    expect(storage.initialValue).toEqual(1)
    expect(storage.write(2)).toEqual(2)
    expect(storage.values).toEqual(2)
    expect(storage.write((prev) => prev + 1)).toEqual(3)
    expect(storage.values).toEqual(3)
  })

  test('should be able to write initialValue and retrieve a value', () => {
    const storage = new LocalStorage<User>('test1', getUser(1))
    expect(storage.values).toEqual(getUser(1))
  })

  test('should be able to write initialValue and retrieve a value with custom encode/decode', () => {
    const storage = new LocalStorage<User>('test2', getUser(1), {
      encode: (value) => {
        expectTypeOf(value).toEqualTypeOf<User>()
        expect(value).toEqual(getUser(1))
        return JSON.stringify(value)
      },
      decode: (value) => {
        expectTypeOf(value).toEqualTypeOf<string>()
        expect(value).toEqual(JSON.stringify(getUser(1)))
        return JSON.parse(value)
      }
    })

    expect(storage.values).toEqual(getUser(1))
  })

  test('should be reset to initialValue', () => {
    const storage = new LocalStorage<User>('test3', getUser(1))
    storage.write(getUser(2))
    expect(storage.values).toEqual(getUser(2))
    storage.reset()
    expect(storage.values).toEqual(getUser(1))
  })

  test('should be return values to initialValue', () => {
    const storage = new LocalStorage<User[]>('test4', [])
    storage.write([getUser(1)])
    localStorage.removeItem('test4')
    expect(storage.values).toEqual([])
  })

  test('should be SyntaxError: Unexpected end of JSON input', () => {
    localStorage.setItem('test-syntax-error', '{') // set invalid data
    const storage = new LocalStorage<User[]>('test-syntax-error', [])
    expect(storage.values).toEqual([]) // return initial data
  })

  test('should be DOMException: Quota exceeded', () => {
    const storage = new LocalStorage('test-dom-exception', '')
    const data = 'some-data'.repeat(9999999)
    expect(storage.write(data)).toBe('') // return initial data
  })
})
