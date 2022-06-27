import React, { useContext } from 'react'
import axios from '../constants/axios';
import { FormErrorMessage } from '../styles/FormStyles';
import { LikesContext } from '../contexts/LikesState';

function LogoutBox({logoutMessage,setLogoutMessage}) {
    const likesManager = useContext(LikesContext);
    
    async function logout() {
        try {
            const response = await axios.delete(
              '/auth/logout',
              {
                withCredentials: true
              }
            );
            setLogoutMessage({message:response.data.message,type:"good"});
            if(response.data.message === "Logged Out succesfully."){
              likesManager.fetchUserLikedThings();
            }
        } catch (err) {
            if (!err?.response) {
              setLogoutMessage({message:"No Server Response",type:"bad"});
            }
            else {
              setLogoutMessage({message:"Logout Failed",type:"bad"});
            }
        }
    };
    
  return (
    <div>
        <button onClick={logout}>LogOut</button>
        <br/>
        <br/>
        <FormErrorMessage type={logoutMessage.type}>
            {logoutMessage.message}
        </FormErrorMessage>
        <br/>
        <br/>
    </div>
  )
}

export default LogoutBox