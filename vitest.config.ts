import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: 'storage',
    environment: 'jsdom'
  }
})
