import { cn, validateEmail } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', false && 'hidden', 'visible');
      expect(result).toBe('base-class visible');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle objects with boolean values', () => {
      const result = cn({ 'active': true, 'disabled': false });
      expect(result).toBe('active');
    });

    it('should merge conflicting Tailwind classes', () => {
      const result = cn('p-4', 'p-2');
      expect(result).toBe('p-2');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle null and undefined', () => {
      const result = cn('base', null, undefined, 'end');
      expect(result).toBe('base end');
    });

    it('should handle mixed inputs', () => {
      const result = cn('base', ['array1', 'array2'], { 'obj-class': true }, false && 'hidden');
      expect(result).toContain('base');
      expect(result).toContain('array1');
      expect(result).toContain('array2');
      expect(result).toContain('obj-class');
      expect(result).not.toContain('hidden');
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
      expect(validateEmail('user123@test-domain.com')).toBe(true);
      expect(validateEmail('a@b.co')).toBe(true);
      expect(validateEmail('user_name@example-domain.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
      expect(validateEmail('user@domain.')).toBe(false);
    });

    it('should return false for emails with spaces', () => {
      expect(validateEmail('test @example.com')).toBe(false);
      expect(validateEmail('test@example .com')).toBe(false);
      expect(validateEmail('test @ example.com')).toBe(false);
      expect(validateEmail(' test@example.com')).toBe(false);
      expect(validateEmail('test@example.com ')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should return false for emails without @ symbol', () => {
      expect(validateEmail('testexample.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
    });

    it('should return false for emails without domain', () => {
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
    });

    it('should return false for emails without TLD', () => {
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test@example.')).toBe(false);
    });

    it('should return false for emails with multiple @ symbols', () => {
      expect(validateEmail('test@@example.com')).toBe(false);
      expect(validateEmail('test@ex@ample.com')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail('a@b.c')).toBe(true);
      expect(validateEmail('user@sub.domain.com')).toBe(true);
      expect(validateEmail('user-name@example-domain.com')).toBe(true);
    });
  });
});
