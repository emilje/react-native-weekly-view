export const measureView = async (viewRef) => {
    return new Promise((res) =>
      viewRef.current.measure((x, y, width, height, pageX, pageY) => {
        res({ x, y, width, height, pageX, pageY });
      })
    );
  };