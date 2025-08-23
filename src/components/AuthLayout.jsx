import React, {useState, useEffect, use, Children} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({children, authentication = true}) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);
    useEffect(() => {
        // todo : make it more easy
        // ig(authStatus === true) {
        //     navigate('/');
        // } else if (authStatus === false) {
        //     navigate('/login');
        // }
        if (authentication && authStatus !== authentication) {
            navigate('/login');
        } else  if(!authentication && authStatus !== authentication) {
            navigate('/');
        }
        else {
            setLoader(false);
        }
    }
    , [authStatus, authentication, navigate]);
  return loader ? <h1>Loading...</h1> : <>{children}</>
}

