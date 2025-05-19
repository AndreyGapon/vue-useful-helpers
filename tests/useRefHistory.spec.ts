import { describe, it, expect, beforeEach } from "vitest";
import { useRefHistory } from "../src/composables/useRefHistory";
import { ref, nextTick } from "vue";

describe("useRefHistory", () => {
  it("stores the history of the source value", async () => {
    const count = ref(0)
    const { history } = useRefHistory(count)

    count.value++
    await nextTick()

    expect(history.value[0].value).toBe(0)
  });

  it("does NOT include the current value in history", async () => {
    const count = ref(0)
    const { history } = useRefHistory(count)

    expect(history.value.length).toBe(0)

    count.value++
    await nextTick()

    expect(history.value.length).toBe(1)
  });

  it("stores the history ordered from newest to oldest", async () => {
    const count = ref(0)
    const { history } = useRefHistory(count);

    count.value++
    await nextTick()
    count.value++
    await nextTick()

    expect(history.value[0].value).toBe(1)
    expect(history.value[1].value).toBe(0)
  });

  it(
    "removes the oldest record(s) when the history reaches the capacity",
    async () => {
      const count = ref(0)
      const { history } = useRefHistory(count, 3);

      for (let i = 0; i < 4; i++) {
        count.value++
        await nextTick()
      }

      expect(history.value.length).toBe(3);
      expect(history.value[history.value.length - 1].value).toBe(1);
    },
  );

  it(
    "allows capacity as a getter (callback function) and dynamically update history when capacity changes",
    async () => {
      const cap = ref(5)
      const count = ref(0)
      const { history } = useRefHistory(count, () => cap.value)

      for (let i = 0; i < 7; i++) {
        count.value++
        await nextTick()
      }

      expect(history.value.length).toBe(5)

      cap.value = 3;
      await nextTick();

      expect(history.value.length).toBe(3);
      expect(history.value[history.value.length - 1].value).toBe(4);
    },
  );

  it(
    "allows capacity as a ref and dynamically update history when capacity changes",
    async () => {
      const cap = ref(5)
      const count = ref(0)
      const { history } = useRefHistory(count, cap)

      for (let i = 0; i < 7; i++) {
        count.value++
        await nextTick()
      }

      expect(history.value.length).toBe(5)

      cap.value = 3;
      await nextTick();

      expect(history.value.length).toBe(3);
      expect(history.value[history.value.length - 1].value).toBe(4);
    },
  );

  it(
    "sets the data source back to the previous value on undo",
    async () => {
      const count = ref(0)
      const { undo } = useRefHistory(count)

      count.value++
      await nextTick()
      undo()
      await nextTick()
      expect(count.value).toBe(0)
    },
  );

  it(
    "sets the data source to one record forward in history on redo",
    async () => {
      const count = ref(0)
      const { redo, undo } = useRefHistory(count)

      count.value++
      await nextTick()
      undo()
      await nextTick()
      redo()
      await nextTick()

      expect(count.value).toBe(1)
    },
  );
});
