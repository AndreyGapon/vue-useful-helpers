import { ref, watch } from "vue";

export const useTheme = (theme: string = "light") => {
  const _theme = ref(theme);

  watch(
    _theme,
    (newTheme) => {
      const htmlEl = document.querySelector("html");
      if (htmlEl) {
        htmlEl.dataset.theme = newTheme;
      }
    },
    {
      immediate: true,
    },
  );

  return _theme;
};
