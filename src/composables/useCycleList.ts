import {
  computed,
  type MaybeRefOrGetter,
  ref,
  toRef,
  toValue, type UnwrapRef,
  watch,
} from "vue";

export const useCycleList = <T>(list: MaybeRefOrGetter<T[]>) => {
  const reactiveList = toRef(list);
  const activeIndex = ref(0);

  const state = computed({
    get: () => reactiveList.value[activeIndex.value],
    set: (value) => {
      reactiveList.value[activeIndex.value] = value;
    },
  });

  function prev() {
    if (activeIndex.value <= 0) {
      activeIndex.value = toValue(list).length - 1;
      return
    }
    activeIndex.value--;
  }

  function next() {
    if (activeIndex.value >= toValue(list).length - 1) {
      activeIndex.value = 0;
      return
    }
    activeIndex.value++;
  }

  watch(reactiveList, () => {
    if (activeIndex.value >= reactiveList.value.length) {
      activeIndex.value = 0;
    }
  });

  return {
    prev,
    next,
    state,
  };
};
