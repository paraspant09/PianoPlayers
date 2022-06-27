import React, { useEffect, useState } from 'react'
import { FaAddressBook, FaCarCrash } from 'react-icons/fa';
import axios from '../constants/axios';
import { FormErrorMessage } from '../styles/FormStyles';
import { ModalClose, Modal, ModalContent, ModalInnerList, ModalTitle } from '../styles/PopUpModalStyles';
import { ActionButton, ManipButtons } from '../styles/ShowListStyles';

function PopUpAddSongToPlaylistModal({modalShow,setmodalShow}) {
    const [searchResult, setsearchResult] = useState({message:null,type:""});
    
    const addSongToAPlaylist = async (id) => {
        try {
            const response = await axios.post(
              '/user/add/song',
              JSON.stringify({song_id:modalShow.id,playlist_id:id}),
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
            setsearchResult({message:response.data.message,type:"good"});
        } catch (err) {
            if (!err?.response) {
                setsearchResult({message:"No Server Response",type:"bad"});
            } 
            else {
                setsearchResult({message:"User Playlists Fetching Failed",type:"bad"});
            }
        }
    };

    const deleteSongFromAPlaylist = async (id) => {
        try {
            const response = await axios.delete(
              '/user/add/song',
              {
                data : {song_id:modalShow.id,playlist_id:id},
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
            setsearchResult({message:response.data.message,type:"good"});
        } catch (err) {
            if (!err?.response) {
                setsearchResult({message:"No Server Response",type:"bad"});
            } 
            else {
                setsearchResult({message:"User Playlists Fetching Failed",type:"bad"});
            }
        }
    };

    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const response = await axios.get(
                  '/user/playlist',
                  {
                    withCredentials: true
                  }
                );
                if(Array.isArray(response.data)){
                    setsearchResult({message:response.data,type:"good"});
                }
                else    setsearchResult({message:response.data.message,type:"good"});
            } catch (err) {
                if (!err?.response) {
                    setsearchResult({message:"No Server Response",type:"bad"});
                } 
                else {
                    setsearchResult({message:"User Playlists Fetching Failed",type:"bad"});
                }
            }
        };

        fetchUserPlaylists();
    }, [])
    
    
  return (
    <Modal>
        <ModalContent>
            <ModalClose onClick={()=> setmodalShow({state:false})}>&times;</ModalClose>
            <ModalTitle>Add To My Playlist</ModalTitle>
            <hr />
            <ModalInnerList>

                { Array.isArray(searchResult.message) ? searchResult.message.map((data)=>{
                    const date=new Date(data.creation_date);
                    return <div style={{marginBottom:"50px"}} key={"List_Playlist_"+data.playlist_id}>
                        <h3>{data.playlist_name}</h3>
                        <p>Details : {data.details}</p>
                        <p>Tag : {data.tag}</p>
                        <p>Creation Date : {date.getDate()}-{date.getMonth()}-{date.getFullYear()}</p>
                        <p>Popularity : {data.popularity}</p>
                        <ManipButtons>
                            <ActionButton color='green' onClick={() => addSongToAPlaylist(data.playlist_id) }><FaAddressBook /></ActionButton>
                            <ActionButton color='red' onClick={() => deleteSongFromAPlaylist(data.playlist_id) }><FaCarCrash /></ActionButton>
                        </ManipButtons>
                    </div>
                    }) :
                    (
                        searchResult.message!=="" &&  
                        <FormErrorMessage style={{color:"black"}} type={searchResult.type}>
                        {searchResult.message}
                        </FormErrorMessage>
                    )
                }
            </ModalInnerList>
        </ModalContent>
    </Modal>
  )
}

export default PopUpAddSongToPlaylistModal