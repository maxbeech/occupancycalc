// Tiny zero-dep test harness shared by every test file.
let passed = 0;
let failed = 0;

export function eq(actual: unknown, expected: unknown, msg: string): void {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    passed++;
  } else {
    failed++;
    console.error(`✗ ${msg}\n    expected ${JSON.stringify(expected)}\n    got      ${JSON.stringify(actual)}`);
  }
}

export function ok(cond: boolean, msg: string): void {
  if (cond) passed++;
  else {
    failed++;
    console.error(`✗ ${msg}`);
  }
}

export function done(suite: string): void {
  console.log(`${failed === 0 ? "✓" : "✗"} ${suite}: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
