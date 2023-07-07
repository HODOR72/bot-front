import { useState } from 'react';

// ----------------------------------------------------------------------

export default function useOpen<Object>(defaultOpened?: boolean, defaultObject?: Object) {
  const [open, setOpen] = useState<boolean>(defaultOpened || false);
  const [object, setObject] = useState<Object | undefined>(undefined);

  return {
    open,
    object,
    onOpen: (object: Object | undefined) => {
      setOpen(true)
      setObject(object)
    },
    onClose: () => {
      setOpen(false)
      setObject(undefined)
    },
  };
}
