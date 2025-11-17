import { cn } from '../utils'

describe('Utils', () => {
  it('should merge classes correctly', () => {
    expect(cn('px-2', 'py-1')).toContain('px-2')
    expect(cn('px-2', 'py-1')).toContain('py-1')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'conditional')).toBe('base')
    expect(cn('base', true && 'conditional')).toContain('conditional')
  })

  it('should handle undefined classes', () => {
    expect(cn('base', undefined)).toBe('base')
    expect(cn(undefined, 'base')).toBe('base')
  })
})