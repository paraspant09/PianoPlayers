import React, { useContext, useEffect, useState } from 'react'
import { FaFireExtinguisher, FaPause, FaPlay, FaThumbsUp } from 'react-icons/fa';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import axios from '../constants/axios';
import { LikesContext } from '../contexts/LikesState';
import { FormErrorMessage } from '../styles/FormStyles';
import { ActionButton } from '../styles/ShowListStyles';
import PopUpAddSongToPlaylistModal from './PopUpAddSongToPlaylistModal';

function Player({setPlayingNote}) {
    const likesManager = useContext(LikesContext);
    const location=useLocation();
    const [isPlaying,setIsPlaying]=useState(false);
    const [songDetails,setSongDetails]=useState({message:null,type:""});
    const [playlistModalShow, setplaylistModalShow] = useState({state:false,id:0});

    const fetchArtistDetails = async (user_id) => {
        try {
            const response = await axios.get(
              `/details/user/${parseInt(user_id)}`
            );
            if(Array.isArray(response.data)){
              setSongDetails({message:response.data,type:"good"});
            }
            else    setSongDetails({message:response.data.message,type:"good"});
        } catch (err) {
            if (!err?.response) {
              setSongDetails({message:"No Server Response",type:"bad"});
            } 
            else {
              setSongDetails({message:"User Songs Fetching Failed",type:"bad"});
            }
        }
    };
    
    const playSong=()=>{
      if(!isPlaying){
        const notesNTime=location.state.song.split(",");
        for (let i = 0; i < notesNTime.length; i++) {
          const noteNTime = notesNTime[i].split(':');
          const time=noteNTime[0];
          const note=noteNTime[1];
          setTimeout(()=>	setPlayingNote([note]),parseInt(time));
        }
      }
      setIsPlaying(s => !s);
    }
    
    useEffect(() => {
      return () => {
        likesManager.setResultMessage({message:null,type:""});
      }
      // eslint-disable-next-line
    }, []);
    
    useEffect(()=>{
      fetchArtistDetails(location.state.user_id);
    },[location.state.user_id]);
   
  return (
    <PlayerBox>
        {playlistModalShow.state && <PopUpAddSongToPlaylistModal modalShow={playlistModalShow} setmodalShow={setplaylistModalShow}/>}

        <ActionButton color='green' onClick={() => playSong()}>{isPlaying?<FaPause />:<FaPlay />}</ActionButton>
        
        { Array.isArray(songDetails.message) && songDetails.message.length===1 && 
          <div>
          { likesManager.resultMessage!=="" &&  <FormErrorMessage type={likesManager.resultMessage.type}>
                {likesManager.resultMessage.message}
            </FormErrorMessage>}
            <ActionButton color='blue'  onClick={() => setplaylistModalShow({state:true,id:location.state.song_id})}><FaFireExtinguisher /></ActionButton>

            <h2>Artist Details</h2>
            <p>First Name : {songDetails.message[0].fname}</p>
            <p>Last Name : {songDetails.message[0].lname??"Not given"}</p>
            <p>BIO : {songDetails.message[0].bio??"Not given"}</p>
            <p>Country Code : {songDetails.message[0].country_code}</p>
            <p>Gender : {songDetails.message[0].gender}</p>
            <p>Popularity : {songDetails.message[0].popularity}</p>
            <span> 
                {<FaThumbsUp style={{color:likesManager.likedArtistsID.has(songDetails.message[0].user_id)?"blue":"white"}} 
                      onClick={() => likesManager.likedArtistsID.has(songDetails.message[0].user_id) ? likesManager.unlike(songDetails.message[0].user_id,"artist") : likesManager.like(songDetails.message[0].user_id,"artist")} /> } 
            </span>

            <h2>Song Details</h2>
            <p>Song Name : {location.state.song_name}</p>
            <p>Upload Date : {location.state.upload_date}</p>
            <p>Popularity : {location.state.popularity}</p>
            <p>Song : {location.state.song}</p>
            <span> 
                {<FaThumbsUp style={{color:likesManager.likedSongsID.has(location.state.song_id)?"blue":"white"}} 
                      onClick={() => likesManager.likedSongsID.has(location.state.song_id) ? likesManager.unlike(location.state.song_id) : likesManager.like(location.state.song_id)} /> } 
            </span>
          </div>
        }
    </PlayerBox>
  )
}

const PlayerBox=styled.div`
    text-align: center;
`

export default Player