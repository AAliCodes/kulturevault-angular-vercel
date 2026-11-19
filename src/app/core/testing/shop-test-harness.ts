import {
  EnvironmentInjector,
  Injector,
  Provider,
  ProviderToken,
  createEnvironmentInjector,
  runInInjectionContext
} from '@angular/core';

export type TestFn = () => void | Promise<void>;

export interface RegisteredTestCase {
  readonly suiteName: string;
  readonly testName: string;
  readonly fn: TestFn;
}

const registeredTests: RegisteredTestCase[] = [];
let currentSuiteName = 'Global Suite';

export function describeShopSuite(suiteName: string, definitionFn: () => void): void {
  const previousSuite = currentSuiteName;
  currentSuiteName = suiteName;
  try {
    definitionFn();
  } finally {
    currentSuiteName = previousSuite;
  }
}

export function itShould(testName: string, fn: TestFn): void {
  registeredTests.push({
    suiteName: currentSuiteName,
    testName,
    fn
  });
}

export function getRegisteredShopTests(): readonly RegisteredTestCase[] {
  return registeredTests;
}

export function assertTrue(condition: boolean, message = 'Expected condition to be true'): void {
  if (!condition) {
    throw new Error(`AssertionError: ${message}`);
  }
}

export function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(
      `AssertionError: ${message ?? 'Values are not equal'} (expected: ${String(
        expected
      )}, actual: ${String(actual)})`
    );
  }
}

export function assertDeepEqual<T>(actual: T, expected: T, message?: string): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(
      `AssertionError: ${message ?? 'Objects are not deeply equal'}\nExpected: ${expectedJson}\nActual:   ${actualJson}`
    );
  }
}

export function assertMatch(actual: string, pattern: RegExp, message?: string): void {
  if (!pattern.test(actual)) {
    throw new Error(
      `AssertionError: ${message ?? `Expected "${actual}" to match ${pattern.toString()}`}`
    );
  }
}

/**
 * Instantiates an Angular @Injectable service inside a real Angular DI context
 * with custom mock/stub providers.
 */
export function instantiateWithAngularDI<T>(
  factory: () => T,
  providers: Provider[] = []
): { instance: T; injector: Injector } {
  const injector = Injector.create({ providers });
  const instance = runInInjectionContext(injector, factory);
  return { instance, injector };
}

export function injectFromTestInjector<T>(injector: Injector, token: ProviderToken<T>): T {
  return injector.get(token);
}
