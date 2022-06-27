import React, { useContext } from 'react'
import axios from '../constants/axios';
import { LikesContext } from '../contexts/LikesState';
import { FormErrorMessage } from '../styles/FormStyles';

function UserDeleteBox({userDelete,setUserDelete}) {
    const likesManager = useContext(LikesContext);
    async function deleteUser() {
        try {
            const response = await axios.delete(
              '/user',
              {
                withCredentials: true
              }
            );
            setUserDelete({message:response.data.message,type:"good"});
            if(response.data.message === "Deletion Successful."){
              likesManager.fetchUserLikedThings();
            }
        } catch (err) {
            if (!err?.response) {
                setUserDelete({message:"No Server Response",type:"bad"});
            }
            else {
                setUserDelete({message:"Delete User Failed",type:"bad"});
            }
        }
    };

  return (
    <div>
        <button onClick={deleteUser}>Delete User</button>
        <br/>
        <br/>
        <FormErrorMessage type={userDelete.type}>
            {userDelete.message}
        </FormErrorMessage>
        <br/>
        <br/>
    </div>
  )
}

export default UserDeleteBox