/**
 * Tests for semantic versioning utilities
 */

import {
  isValidSemVer,
  parseVersion,
  compareVersions,
  incrementVersion,
  formatVersion,
} from '../utils/semver';

describe('Semantic Versioning Utilities', () => {
  describe('isValidSemVer', () => {
    it('should validate correct semantic versions', () => {
      expect(isValidSemVer('1.0.0')).toBe(true);
      expect(isValidSemVer('0.0.1')).toBe(true);
      expect(isValidSemVer('10.20.30')).toBe(true);
      expect(isValidSemVer('1.1.2-prerelease+meta')).toBe(true);
      expect(isValidSemVer('1.1.2+meta')).toBe(true);
      expect(isValidSemVer('1.1.2-alpha')).toBe(true);
      expect(isValidSemVer('1.0.0-alpha.beta')).toBe(true);
      expect(isValidSemVer('1.0.0-alpha.1')).toBe(true);
    });

    it('should reject invalid semantic versions', () => {
      expect(isValidSemVer('1')).toBe(false);
      expect(isValidSemVer('1.2')).toBe(false);
      expect(isValidSemVer('1.2.3-')).toBe(false);
      expect(isValidSemVer('1.2.3+')).toBe(false);
      expect(isValidSemVer('01.1.1')).toBe(false);
      expect(isValidSemVer('1.01.1')).toBe(false);
      expect(isValidSemVer('1.1.01')).toBe(false);
      expect(isValidSemVer('1.2.3.4')).toBe(false);
      expect(isValidSemVer('')).toBe(false);
    });
  });

  describe('parseVersion', () => {
    it('should parse basic semantic versions', () => {
      const version = parseVersion('1.2.3');
      expect(version).toEqual({
        version: '1.2.3',
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: undefined,
        buildMetadata: undefined,
      });
    });

    it('should parse versions with prerelease', () => {
      const version = parseVersion('1.2.3-alpha.1');
      expect(version).toEqual({
        version: '1.2.3-alpha.1',
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: 'alpha.1',
        buildMetadata: undefined,
      });
    });

    it('should parse versions with build metadata', () => {
      const version = parseVersion('1.2.3+build.1');
      expect(version).toEqual({
        version: '1.2.3+build.1',
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: undefined,
        buildMetadata: 'build.1',
      });
    });

    it('should parse versions with both prerelease and build metadata', () => {
      const version = parseVersion('1.2.3-alpha.1+build.1');
      expect(version).toEqual({
        version: '1.2.3-alpha.1+build.1',
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: 'alpha.1',
        buildMetadata: 'build.1',
      });
    });

    it('should throw error for invalid versions', () => {
      expect(() => parseVersion('invalid')).toThrow(
        'Invalid semantic version: invalid'
      );
    });
  });

  describe('compareVersions', () => {
    it('should compare major versions', () => {
      expect(compareVersions('2.0.0', '1.0.0')).toBe(1);
      expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    });

    it('should compare minor versions', () => {
      expect(compareVersions('1.2.0', '1.1.0')).toBe(1);
      expect(compareVersions('1.1.0', '1.2.0')).toBe(-1);
      expect(compareVersions('1.1.0', '1.1.0')).toBe(0);
    });

    it('should compare patch versions', () => {
      expect(compareVersions('1.1.2', '1.1.1')).toBe(1);
      expect(compareVersions('1.1.1', '1.1.2')).toBe(-1);
      expect(compareVersions('1.1.1', '1.1.1')).toBe(0);
    });

    it('should handle prerelease versions', () => {
      expect(compareVersions('1.0.0-alpha', '1.0.0')).toBe(-1);
      expect(compareVersions('1.0.0', '1.0.0-alpha')).toBe(1);
      expect(compareVersions('1.0.0-alpha', '1.0.0-beta')).toBe(-1);
      expect(compareVersions('1.0.0-beta', '1.0.0-alpha')).toBe(1);
    });
  });

  describe('incrementVersion', () => {
    it('should increment patch version', () => {
      expect(incrementVersion('1.2.3', 'patch')).toBe('1.2.4');
      expect(incrementVersion('0.0.0', 'patch')).toBe('0.0.1');
    });

    it('should increment minor version and reset patch', () => {
      expect(incrementVersion('1.2.3', 'minor')).toBe('1.3.0');
      expect(incrementVersion('0.0.5', 'minor')).toBe('0.1.0');
    });

    it('should increment major version and reset minor and patch', () => {
      expect(incrementVersion('1.2.3', 'major')).toBe('2.0.0');
      expect(incrementVersion('0.5.10', 'major')).toBe('1.0.0');
    });

    it('should throw error for invalid version type', () => {
      expect(() => incrementVersion('1.0.0', 'invalid' as any)).toThrow(
        'Invalid version type: invalid'
      );
    });
  });

  describe('formatVersion', () => {
    it('should format basic version', () => {
      const versionInfo = {
        version: '1.2.3',
        major: 1,
        minor: 2,
        patch: 3,
      };
      expect(formatVersion(versionInfo)).toBe('1.2.3');
    });

    it('should format version with prerelease', () => {
      const versionInfo = {
        version: '1.2.3-alpha.1',
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: 'alpha.1',
      };
      expect(formatVersion(versionInfo)).toBe('1.2.3-alpha.1');
    });

    it('should format version with build metadata', () => {
      const versionInfo = {
        version: '1.2.3+build.1',
        major: 1,
        minor: 2,
        patch: 3,
        buildMetadata: 'build.1',
      };
      expect(formatVersion(versionInfo)).toBe('1.2.3+build.1');
    });

    it('should format version with both prerelease and build metadata', () => {
      const versionInfo = {
        version: '1.2.3-alpha.1+build.1',
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: 'alpha.1',
        buildMetadata: 'build.1',
      };
      expect(formatVersion(versionInfo)).toBe('1.2.3-alpha.1+build.1');
    });
  });
});
