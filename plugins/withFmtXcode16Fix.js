const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to fix fmt library build errors with Xcode 16+.
 * Xcode 16 uses a stricter consteval enforcement in Clang that breaks
 * older versions of the fmt library used by React Native dependencies.
 * The fix switches the fmt pod to C++17 (via xcconfig) so the consteval
 * code path is not compiled.
 */
const withFmtXcode16Fix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      const SENTINEL = '# FMT_XCODE16_FIX_V3';

      const fix = `
    ${SENTINEL}
    # Fix for Xcode 16+ stricter consteval enforcement breaking older fmt library.
    # Appends -std=c++17 via OTHER_CPLUSPLUSFLAGS so it overrides the c++20 standard
    # flag on the clang command line (last -std= flag wins), disabling consteval.
    installer.pods_project.targets.each do |target|
      if target.name == 'fmt'
        target.build_configurations.each do |config|
          config.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -std=c++17'
        end
      end
    end
`;

      if (podfile.includes(SENTINEL)) {
        // Already has the current fix version
        return config;
      }

      // Remove any previous version of this fix by tracking Ruby block depth.
      // All versions start with a # FMT_XCODE16_FIX_V* sentinel comment.
      const sentinelPattern = /# FMT_XCODE16_FIX_V\d+/;
      if (sentinelPattern.test(podfile)) {
        const lines = podfile.split('\n');
        const startIdx = lines.findIndex(l => sentinelPattern.test(l));
        if (startIdx >= 0) {
          // Count Ruby block openers/closers to find the end of the block
          let depth = 0;
          let endIdx = startIdx;
          for (let i = startIdx; i < lines.length; i++) {
            const l = lines[i];
            // Count do/if/def openers (but not end-of-line `end` on same line as open)
            depth += (l.match(/\b(do|if|def)\b/g) || []).length;
            depth -= (l.match(/\bend\b/g) || []).length;
            if (depth <= 0 && i > startIdx) {
              endIdx = i;
              break;
            }
          }
          lines.splice(startIdx, endIdx - startIdx + 1);
          podfile = lines.join('\n');
        }
      }

      podfile = podfile.replace(
        /post_install do \|installer\|/,
        `post_install do |installer|\n${fix}`
      );

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
};

module.exports = withFmtXcode16Fix;
