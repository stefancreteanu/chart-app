import { useState } from 'react';

const useLoginStatus = () => {
  const [isLoggedIn] = useState(() =>
     window.localStorage.getItem('token') ? true : false
  );
  return isLoggedIn;
}

export default useLoginStatus;