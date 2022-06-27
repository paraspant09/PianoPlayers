import React, { useEffect, useState } from 'react'
import axios from '../constants/axios';

export const LikesContext=React.createContext();

function LikesState(props) {
  const [likedSongsID, setLikedSongsID] = useState(new Set());
  const [likedArtistsID, setLikedArtistsID] = useState(new Set());
  const [likedPlaylistID, setLikedPlaylistID] = useState(new Set());
  const [resultMessage,setResultMessage]=useState({message:null,type:""});
  
  const like = async (id,what="song") => {
    try {
        let SearchString="",SearchObj={};
        if(what==="song"){
          SearchObj["song_id"]=id;
          SearchString='/user/like/song';
        }
        else if(what==="artist"){
          SearchObj["artist_id"]=id;
          SearchString='/user/like/artist';
        }
        else{
          SearchObj["playlist_id"]=id;
          SearchString='/user/add/playlist';
        }

        const response = await axios.post(
            SearchString,
            JSON.stringify(SearchObj),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
        );
        if(response.data.message === "Liked Successfully.")  {
          if(what==="song"){
            setLikedSongsID(s => new Set([...s, id]));
          }
          else if(what==="artist"){
            setLikedArtistsID(s => new Set([...s, id]));
          }
          else{
            setLikedPlaylistID(s => new Set([...s, id]));
          }
        }
        setResultMessage({message:response.data.message,type:"good"});
    } catch (err) {
        if (!err?.response) {
          setResultMessage({message:"No Server Response",type:"bad"});
        } 
        else {
          setResultMessage({message:"Song Liking Failed",type:"bad"});
        }
    }
  };

  const unlike = async (id,what="song") => {
    try {
        let SearchString="",SearchObj={};
        if(what==="song"){
          SearchObj["song_id"]=id;
          SearchString='/user/like/song';
        }
        else if(what==="artist"){
          SearchObj["artist_id"]=id;
          SearchString='/user/like/artist';
        }
        else{
          SearchObj["playlist_id"]=id;
          SearchString='/user/add/playlist';
        }

        const response = await axios.delete(
            SearchString,
            {
              data: SearchObj,
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
        );
        if(response.data.message === "Removed Like Successfully.")  {
          if(what==="song"){
            setLikedSongsID(s => new Set([...s].filter(x => x !== id)));
          }
          else if(what==="artist"){
            setLikedArtistsID(s => new Set([...s].filter(x => x !== id)));
          }
          else{
            setLikedPlaylistID(s => new Set([...s].filter(x => x !== id)));
          }
        }
        setResultMessage({message:response.data.message,type:"good"});
    } catch (err) {
        if (!err?.response) {
          setResultMessage({message:"No Server Response",type:"bad"});
        } 
        else {
          setResultMessage({message:"Song Remove Like Failed",type:"bad"});
        }
    }
  };

  const fetchUserLikedThings = async () => {
    try {
        const song_response = await axios.get(
          '/user/like/song',
          {
            withCredentials: true
          }
        );
        if(Array.isArray(song_response.data)){
          setLikedSongsID(new Set(song_response.data.map(song => {
            return song.song_id;
          })));
        }
        else  setLikedSongsID(new Set());
        
        const artist_response = await axios.get(
          '/user/like/artist',
          {
            withCredentials: true
          }
        );
        if(Array.isArray(artist_response.data)){
          setLikedArtistsID(new Set(artist_response.data.map(artist => {
            return artist.artist_id;
          })));
        }
        else  setLikedArtistsID(new Set());

        const playlist_response = await axios.get(
          '/user/add/playlist',
          {
            withCredentials: true
          }
        );
        if(Array.isArray(playlist_response.data)){
          setLikedPlaylistID(new Set(playlist_response.data.map(playlist => {
            return playlist.playlist_id;
          })));
        }
        else  setLikedPlaylistID(new Set());
    } catch (err) {
        if (!err?.response) {
          setResultMessage({message:"No Server Response",type:"bad"});
        } 
        else {
          setResultMessage({message:"User Liked Things Fetching Failed",type:"bad"});
        }
    }
  };

  useEffect(()=>{
      fetchUserLikedThings();
  },[]);

  return (
    <LikesContext.Provider value={{likedSongsID,likedArtistsID,likedPlaylistID,resultMessage,like,unlike,setResultMessage,fetchUserLikedThings}}>
      {props.children}
    </LikesContext.Provider>
  )
}

export default LikesState