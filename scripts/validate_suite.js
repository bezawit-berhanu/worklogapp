import { execSync } from 'node:child_process';

console.log('=== WORKLOG VERIFICATION SUITE ===\n');

try {
  console.log('1. Executing Unit Test Suites...');
  execSync('npm test', { stdio: 'inherit' });
  console.log('\n✓ Unit tests passed cleanly.\n');

  console.log('2. Executing Production Build (Typecheck + Vite)...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✓ Production build completed without errors.\n');

  console.log('3. Checking Git Commit Count...');
  const count = execSync('git rev-list --count HEAD').toString().trim();
  console.log(`✓ Total Git Commits on main: ${count}`);

  console.log('\n=== ALL VERIFICATION CHECKS PASSED ===');
} catch (error) {
  console.error('\n✖ Verification failed:', error);
  process.exit(1);
}
