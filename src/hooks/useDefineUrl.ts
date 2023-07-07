import { useLocation } from "react-router";

export default function useDefineUrl(){
    const { pathname } = useLocation();
    const urls = ['course' , 'workout'];
    let activeUrl = '';
    for(let i=0; urls.length > 0; i++){
        if(pathname.match(urls[i])){
          activeUrl = urls[i];
          break;
        }
    }
    return activeUrl;
}