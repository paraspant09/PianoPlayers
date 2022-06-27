import React, { useContext, useEffect, useRef, useState } from 'react'
import {BoxName,List,Head,HeadSpan,ListEntry,Desc,Title,Body,Time,Dates,ManipButtons,ActionButton, DynamicTitle, ListContainer, Scroller} from '../styles/ShowListStyles'
import axios from '../constants/axios'
import { FormErrorMessage } from '../styles/FormStyles';
import {FaTrash,FaPencilAlt,FaPlay, FaThumbsUp, FaArrowAltCircleUp, FaArrowAltCircleDown, FaFireExtinguisher} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { LikesContext } from '../contexts/LikesState';
import PopUpAddSongToPlaylistModal from './PopUpAddSongToPlaylistModal';

function UserSongsList({logoutMessage,userDelete}) {
  const likesManager = useContext(LikesContext);

    const navigate=useNavigate();
    const userSonglistContainer=useRef(null);
    const likedSonglistContainer=useRef(null);

    const [ownSongs,setOwnSongs]=useState({message:null,type:""});
    const [likedSongs,setLikedSongs]=useState({message:null,type:""});
    const [resultMessage,setResultMessage]=useState({message:null,type:""});

    const [updateData, setUpdateData] = useState(new Map());
    const [playlistModalShow, setplaylistModalShow] = useState({state:false,id:0});
  
  const Scroll = async (container,up=true) => {
    const list=container.current;
    const listTop=list.children[0];
    const change=listTop.offsetHeight+5;  //Bottom margin on list entry of 5px

    let prevVal=parseInt(listTop.style.marginTop.substring(0,listTop.style.marginTop.length-2));
    prevVal = up ? ( (prevVal > (list.children.length-2)*-change) ? prevVal-change : prevVal ) : (prevVal!==0 ? prevVal+change: prevVal) ;
    listTop.style.marginTop=prevVal+"px";
  }
    
  const fetchUserSongs = async () => {
      try {
          const response = await axios.get(
            '/user/song',
            {
              withCredentials: true
            }
          );
          if(Array.isArray(response.data)){
            setOwnSongs({message:response.data,type:"good"});
          }
          else    setOwnSongs({message:response.data.message,type:"good"});
      } catch (err) {
          if (!err?.response) {
            setOwnSongs({message:"No Server Response",type:"bad"});
          } 
          else {
            setOwnSongs({message:"User Songs Fetching Failed",type:"bad"});
          }
      }
  };

  const fetchUserLikedSongs = async () => {
    try {
        const response = await axios.get(
          '/user/like/song',
          {
            withCredentials: true
          }
        );
        if(Array.isArray(response.data)){
          setLikedSongs({message:response.data,type:"good"});
        }
        else    setLikedSongs({message:response.data.message,type:"good"});
    } catch (err) {
        if (!err?.response) {
          setLikedSongs({message:"No Server Response",type:"bad"});
        } 
        else {
          setLikedSongs({message:"User Liked Songs Fetching Failed",type:"bad"});
        }
    }
  };

  const deleteSong = async (song_id) => {
    try {
        const response = await axios.delete(
            '/user/song',
            {
              data:{ song_id },
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
        );
        fetchUserSongs();
        setResultMessage({message:response.data.message,type:"good"});
    } catch (err) {
        if (!err?.response) {
          setResultMessage({message:"No Server Response",type:"bad"});
        } 
        else {
          setResultMessage({message:"Song delete Failed",type:"bad"});
        }
    }
  };

  const updateSong = async (song_id) => {
    try {
        song_id=parseInt(song_id);
        const validateSchema=Yup.object().shape({
          song_id: Yup.number().min(1,"Minimum value is 1.").required("Song ID is required"),
          song_name: Yup.string().matches(/^([a-zA-Z]+\s?)+$/,"Song name must be words with space between.")
                .min(3,"Should be 3 chars minimum").max(50,"Should be 50 chars maximum"),
          status: Yup.string()
        })
        await validateSchema.validate({song_id,...updateData.get(song_id)});

        const response = await axios.put(
            '/user/song',
            JSON.stringify({song_id,...updateData.get(song_id)}),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true
            }
        );
        setResultMessage({message:response.data.message,type:"good"});
        fetchUserSongs();
        fetchUserLikedSongs();
        setUpdateData(new Map());
    } catch (err) {
        if(err.name==="ValidationError")  setResultMessage({message:err.message,type:"bad"});
        else if (!err?.response) {
          setResultMessage({message:"No Server Response",type:"bad"});
        } 
        else {
          setResultMessage({message:"Song Update Failed",type:"bad"});
        }
    }
  };
    useEffect(() => {
      return () => {
        likesManager.setResultMessage({message:null,type:""});
      }
      // eslint-disable-next-line
    }, []);

    useEffect(()=>{
        fetchUserSongs();
        fetchUserLikedSongs();
    },[logoutMessage,userDelete,likesManager.likedSongsID]);

  return (
    <>
      {playlistModalShow.state && <PopUpAddSongToPlaylistModal modalShow={playlistModalShow} setmodalShow={setplaylistModalShow}/>}

      {(Array.isArray(ownSongs.message) && Array.isArray(likedSongs.message) && <BoxName>Songs</BoxName>)}
      { resultMessage!=="" &&  <FormErrorMessage type={resultMessage.type}>
                  {resultMessage.message}
              </FormErrorMessage>}
      { likesManager.resultMessage!=="" &&  <FormErrorMessage type={likesManager.resultMessage.type}>
                  {likesManager.resultMessage.message}
              </FormErrorMessage>}
      <List>
        {
          Array.isArray(ownSongs.message) ?
            <div>
              <Head><HeadSpan>My Songs</HeadSpan></Head>
              <Scroller>
                <button onClick={() => Scroll(userSonglistContainer)}><FaArrowAltCircleUp /></button>
              </Scroller>
              <ListContainer ref={userSonglistContainer}>
                  {ownSongs.message.map((song)=>{
                    return <ListEntry key={"mysong_"+song.song_id} style={{marginTop:"0px"}}>
                              <Desc>
                                <DynamicTitle type="text" value={updateData.get(song.song_id) && updateData.get(song.song_id).song_name ? updateData.get(song.song_id).song_name : song.song_name} 
                                              onChange={(e)=> setUpdateData(map => new Map(map.set(song.song_id, {...map.get(song.song_id),song_name:e.target.value})) )}/>

                                <Body>
                                  <span> {song.status==="PUB" && song.popularity} &nbsp;&nbsp;{song.status==="PUB" && <FaThumbsUp style={{color:likesManager.likedSongsID.has(song.song_id)?"blue":"white"}} onClick={() => likesManager.likedSongsID.has(song.song_id) ? likesManager.unlike(song.song_id) : likesManager.like(song.song_id)} /> } </span>
                                  <Status  value={updateData.get(song.song_id) && updateData.get(song.song_id).status ? updateData.get(song.song_id).status : song.status} 
                                          onChange={(e)=> setUpdateData(map => new Map(map.set(song.song_id, {...map.get(song.song_id),status:e.target.value})) )} 
                                          status={updateData.get(song.song_id) && updateData.get(song.song_id).status ? updateData.get(song.song_id).status : song.status} >
                                    <option value="PUB">PUB</option>
                                    <option value="PRI">PRI</option>
                                  </Status>
                                </Body>
                              </Desc>
                              <Time>
                                <Dates>{`${new Date(song.upload_date).toLocaleString()}`.split(',')[0]}</Dates>
                              </Time>
                              <ManipButtons>
                                <ActionButton color='green' onClick={() => navigate('/',{state:song}) }><FaPlay /></ActionButton>
                                <ActionButton color='red' onClick={() => deleteSong(`${song.song_id}`)}><FaTrash /></ActionButton>
                                <ActionButton color='blue' onClick={() => updateSong(`${song.song_id}`)}><FaPencilAlt /></ActionButton>
                                { song.status==="PUB" && <ActionButton color='orange'  onClick={() => setplaylistModalShow({state:true,id:song.song_id})}><FaFireExtinguisher /></ActionButton>}
                              </ManipButtons>
                          </ListEntry>
                })}
              </ListContainer>
              <Scroller>
                <button onClick={() => Scroll(userSonglistContainer,false)}><FaArrowAltCircleDown /></button>
              </Scroller>
            </div>
            :
          <FormErrorMessage type={ownSongs.type}>
                  {ownSongs.message}
              </FormErrorMessage>
        }
        {
          Array.isArray(likedSongs.message) ?
            <div>
              <Head><HeadSpan>Liked Songs</HeadSpan></Head>
              <Scroller>
                <button onClick={() => Scroll(likedSonglistContainer)}><FaArrowAltCircleUp /></button>
              </Scroller>
              <ListContainer ref={likedSonglistContainer}>
                  {likedSongs.message.map((song)=>{
                  return <ListEntry key={"liked_song_"+song.song_id} style={{marginTop:"0px"}}>
                              <Desc>
                                <Title>{song.song_name}</Title>
                                <Body><span>{song.popularity} &nbsp;&nbsp;<FaThumbsUp style={{color:likesManager.likedSongsID.has(song.song_id)?"blue":"white"}} onClick={() => likesManager.likedSongsID.has(song.song_id) ? likesManager.unlike(song.song_id) : likesManager.like(song.song_id)} /></span></Body>
                              </Desc>
                              <Time>
                                <Dates>{`${new Date(song.upload_date).toLocaleString()}`.split(',')[0]}</Dates>
                              </Time>
                              <ManipButtons>
                                <ActionButton color='green' onClick={() => navigate('/',{state:song}) }><FaPlay /></ActionButton>
                              </ManipButtons>
                          </ListEntry>
                  })}
              </ListContainer>
              <Scroller>
                <button onClick={() => Scroll(likedSonglistContainer,false)}><FaArrowAltCircleDown /></button>
              </Scroller>
            </div>
            :
          <FormErrorMessage type={likedSongs.type}>
                  {likedSongs.message}
              </FormErrorMessage>
        }
      </List>		
    </>
  )
}

const Status=styled.select`
  background-color: ${props => props.status==="PUB"?'green':'red'};
  font-weight:bold;
  padding: 5px;
  border: 5px;
`

export default UserSongsList