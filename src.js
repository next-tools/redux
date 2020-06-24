import { useMemo } from "react";

export default function (initStore) {
  let reduxStore;

  const initRedux = function (initState) {
    let _reduxStore = reduxStore ?? initStore(initState);

    if (initState && reduxStore) {
      _reduxStore = initStore({
        ...reduxStore.getState(),
        ...initState
      });
      reduxStore = undefined;
    }

    if (typeof window === "undefined") {
      return _reduxStore;
    }

    if (!reduxStore) {
      reduxStore = _reduxStore;
    }

    return _reduxStore;
  };

  const useRedux = function (initState) {
    const reduxStore = useMemo(() => initRedux(initState), [initState]);

    return reduxStore;
  };

  return { initRedux, useRedux };
}
