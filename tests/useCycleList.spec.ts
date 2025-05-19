import { describe, it, expect, beforeEach, test } from "vitest";

import { useCycleList } from "../src/composables/useCycleList";
import { nextTick, ref } from "vue";

describe("useCycleList", () => {
  test(
    "returns the first item in the array as the state before prev or next",
    () => {
      const { state } = useCycleList(['a', 'b', 'c']);
      expect(state.value).toBe('a')
    },
  );
  test("sets state to the next item in the array on next()", () => {
    const { state, next } = useCycleList(['a', 'b', 'c']);
    next()
    expect(state.value).toBe('b')
  });

  test("sets state to the previous item in the array on prev()", () => {
    const { state, next, prev } = useCycleList(['a', 'b', 'c']);
    next()
    expect(state.value).toBe('b')
    prev()
    expect(state.value).toBe('a')
  });

  test("cycles to the end on prev if at beginning", () => {
    const { state, prev } = useCycleList(['a', 'b', 'c']);
    prev()
    expect(state.value).toBe('c')
  });

  test("cycles to the beginning on next if at the end", () => {
    const { state, next } = useCycleList(['a', 'b', 'c']);
    next()
    next()
    next()
    expect(state.value).toBe('a')
  });

  test("Bonus: works with refs", () => {
    const array = ref(['a', 'b', 'c']);
    const { state, next, prev } = useCycleList(array);
    next()
    expect(state.value).toBe('b')
    prev()
    expect(state.value).toBe('a')
  });

  test("Bonus: works when the provided ref changes value", () => {
    const list = ref(["a", "b"]);
    const { state, next, prev } = useCycleList(list);
    next();
    expect(state.value).toBe("b");

    list.value.push("c");

    next();
    expect(state.value).toBe("c");
  });

  test(
    "Bonus: resets index to 0 if updated ref doesn't include the activeIndex",
    async () => {
      const array = ref(['a', 'b', 'c']);
      const { state, next } = useCycleList(array);
      next()
      next()
      array.value = ['d', 'e']
      await nextTick()
      expect(state.value).toBe('d')
    },
  );

  test("let's you directly mutate the state", () => {
    const list = ref(["a", "b", "c"]);
    const { state, next, prev } = useCycleList(list);
    next();
    state.value = "b changed";
    expect(JSON.stringify(list.value)).toBe(
      JSON.stringify(["a", "b changed", "c"]),
    );
  })
});
