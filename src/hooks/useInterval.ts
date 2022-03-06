import { useEffect, useState } from 'react';

type UseIntervalProps = {
  updateFunction: () => void,
  intervalMs: number,
  dependencies: unknown[],
}

export default function useInterval(props: UseIntervalProps) {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  useEffect(
    () => {
      const timeoutId = setTimeout(
        () => {
          setLastUpdate(Date.now());
          props.updateFunction();
        },
        props.intervalMs - (Date.now() - lastUpdate),
      );

      return () => clearTimeout(timeoutId);
    },
    [...props.dependencies, lastUpdate],
  );
}
