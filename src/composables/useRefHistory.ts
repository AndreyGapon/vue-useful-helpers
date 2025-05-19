import type { Ref, MaybeRefOrGetter, UnwrapRef } from "vue";
import { ref, watch, nextTick, watchEffect, toValue } from "vue";

interface HistoryRecord<T> {
  value: T;
  timestamp: number;
}

export const useRefHistory = <T>(
  source: Ref<T>,
  capacity: MaybeRefOrGetter<number> = Infinity,
) => {
  const history = ref<HistoryRecord<T>[]>([]);
  const future = ref<HistoryRecord<T>[]>([]);

  let doingUndo = false;
  let doingRedo = false;

  let lastChanged = Date.now();

  watch(source, (newVal, oldValue) => {
    if (doingUndo || doingRedo) return;

    future.value = [];

    const cap = toValue(capacity);

    if (cap === 0) return;
    if (cap === history.value.length) history.value.pop();

    history.value.unshift(
      clone({
        value: oldValue,
        timestamp: lastChanged,
      }),
    );

    lastChanged = Date.now();
  });

  function undo() {
    doingUndo = true;
    const record = history.value.shift();

    if (record) {
      future.value.unshift(
        clone({
          value: source.value,
          timestamp: Date.now(),
        }),
      );

      source.value = clone(record.value);
    }

    nextTick(() => (doingUndo = false));
  }

  function redo() {
    doingRedo = true;
    const record = future.value.shift();
    if (record) {
      history.value.unshift(
        clone({
          value: source.value,
          timestamp: Date.now(),
        }),
      );
      source.value = clone(record.value);
    }
    nextTick(() => {
      doingRedo = false;
    });
  }

  watchEffect(() => {
    const cap = toValue(capacity);
    if (history.value.length > cap) {
      history.value = history.value.slice(0, cap);
    }
  });

  return {
    undo,
    redo,
    history,
  };
};

function clone(value: any) {
  return JSON.parse(JSON.stringify(value));
}
