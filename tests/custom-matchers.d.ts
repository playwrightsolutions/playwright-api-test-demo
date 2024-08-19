declare namespace jest {
    interface Matchers<R> {
      toBeNumber(): R;
      toBeString(): R;
      // Add other custom matchers here...
    }
  }