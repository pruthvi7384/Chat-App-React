import {useCallback, useRef, useState, useEffect} from 'react';
import { database } from './config';

export const useModules = (defaultModules = false) => {
    const [isOpen, setIsopen] = useState(defaultModules)
    const open = useCallback(()=>{
        setIsopen(true);
    },[]);
    const close = useCallback(()=>{
        setIsopen(false);
    },[]);
    return {isOpen , open, close};
}

export const useMediaQuery = query => {
    const [matches, setMatches] = useState(
      () => window.matchMedia(query).matches
    );
  
    useEffect(() => {
      const queryList = window.matchMedia(query);
      setMatches(queryList.matches);
  
      const listener = evt => setMatches(evt.matches);
  
      queryList.addListener(listener);
      return () => queryList.removeListener(listener);
    }, [query]);
  
    return matches;
  };
  
  export function usePresence(uid){
    const [presence,setPresence] = useState(null);
    useEffect(() => {
      const useStateRef = database.ref(`/status/${uid}`);
      useStateRef.on('value', (snap) =>{
          if(snap.exists()){
              const data = snap.val();
              setPresence(data);
          }
      })
      return ()=>{
        useStateRef.off()
      }
    },[uid]);
    return presence;

  }
  
export function useHover() {
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);
      }
      return () => {
        node.removeEventListener("mouseover", handleMouseOver);
        node.removeEventListener("mouseout", handleMouseOut);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref.current] // Recall only if ref changes
  );
  return [ref, value];
}