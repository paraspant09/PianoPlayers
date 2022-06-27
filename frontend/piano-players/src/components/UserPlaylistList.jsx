import React, { useContext, useEffect, useRef, useState } from 'react'
import {BoxName,List,Head,HeadSpan,ListEntry,Desc,Title,Body,Time,Dates,ManipButtons,ActionButton, DynamicTitle, ListContainer, Scroller, SubTitle} from '../styles/ShowListStyles'
import axios from '../constants/axios'
import { FormErrorMessage } from '../styles/FormStyles';
import {FaTrash,FaPencilAlt, FaThumbsUp, FaArrowAltCircleUp, FaArrowAltCircleDown, FaFireExtinguisher} from 'react-icons/fa';
import * as Yup from 'yup';
import { LikesContext } from '../contexts/LikesState';
import PopUpListModal from './PopUpListModal';

function UserPlaylistList({logoutMessage,userDelete}) {
  const likesManager = useContext(LikesContext);

    const userPlaylistsContainer=useRef(null);
    const likedPlaylistsContainer=useRef(null);

    const [ownPlaylists,setOwnPlaylists]=useState({message:null,type:""});
    const [likedPlaylists,setLikedPlaylists]=useState({message:null,type:""});
    const [resultMessage,setResultMessage]=useState({message:null,type:""});

    const [updateData, setUpdateData] = useState(new Map());
    const [modalShow, setmodalShow] = useState({state:false,of:"",id:0});
  
  const Scroll = async (container,up=true) => {
    const list=container.current;
    const listTop=list.children[0];
    const change=listTop.offsetHeight+5;  //Bottom margin on list entry of 5px
    
    let prevVal=parseInt(listTop.style.marginTop.substring(0,listTop.style.marginTop.length-2));
    prevVal = up ? ( (prevVal > (list.children.length-2)*-change) ? prevVal-change : prevVal ) : (prevVal!==0 ? prevVal+change: prevVal) ;
    listTop.style.marginTop=prevVal+"px";
  }
    
  const fetchUserPlaylists = async () => {
      try {
          const response = await axios.get(
            '/user/playlist',
            {
              withCredentials: true
            }
          );
          if(Array.isArray(response.data)){
            setOwnPlaylists({message:response.data,type:"good"});
          }
          else    setOwnPlaylists({message:response.data.message,type:"good"});
      } catch (err) {
          if (!err?.response) {
            setOwnPlaylists({message:"No Server Response",type:"bad"});
          } 
          else {
            setOwnPlaylists({message:"User Songs Fetching Failed",type:"bad"});
          }
      }
  };

  const fetchUserLikedPlaylists = async () => {
    try {
        const response = await axios.get(
          '/user/add/playlist',
          {
            withCredentials: true
          }
        );
        if(Array.isArray(response.data)){
          setLikedPlaylists({message:response.data,type:"good"});
        }
        else    setLikedPlaylists({message:response.data.message,type:"good"});
    } catch (err) {
        if (!err?.response) {
          setLikedPlaylists({message:"No Server Response",type:"bad"});
        } 
        else {
          setLikedPlaylists({message:"User Liked Songs Fetching Failed",type:"bad"});
        }
    }
  };

  const deletePlaylist = async (playlist_id) => {
    try {
        const response = await axios.delete(
            '/user/playlist',
            {
              data:{ playlist_id },
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
        );
        setResultMessage({message:response.data.message,type:"good"});
        fetchUserPlaylists();
        fetchUserLikedPlaylists();
    } catch (err) {
        if (!err?.response) {
          setResultMessage({message:"No Server Response",type:"bad"});
        } 
        else {
          setResultMessage({message:"Playlist delete Failed",type:"bad"});
        }
    }
  };

  const updatePlaylist = async (playlist_id) => {
    try {
        playlist_id=parseInt(playlist_id);
        const validateSchema=Yup.object().shape({
          playlist_id: Yup.number().min(1,"Minimum value is 1.").required("Playlist ID is required"),
          playlist_name: Yup.string().matches(/^([a-zA-Z]+\s?)+$/,"Playlist name must be words with space between.")
                .min(3,"Should be 3 chars minimum").max(50,"Should be 50 chars maximum"),
          details:Yup.string().matches(/^[a-zA-Z\s]+.$/,"Playlist details must be words with space between( can be ended with full stop )").trim()
                .min(5,"Should be 5 chars minimum").max(255,"Should be 255 chars maximum"),
          tag:Yup.string().matches(/^#[a-zA-Z0-9(_)]+$/,"Playlist tag must be hashtags with or without underscores alphabet or numbers")
                .min(3,"Should be 3 chars minimum").max(30,"Should be 30 chars maximum")
        })
        await validateSchema.validate({playlist_id,...updateData.get(playlist_id)});

        const response = await axios.put(
            '/user/playlist',
            JSON.stringify({playlist_id,...updateData.get(playlist_id)}),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true
            }
        );
        setResultMessage({message:response.data.message,type:"good"});
        fetchUserPlaylists();
        fetchUserLikedPlaylists();
        setUpdateData(new Map());
    } catch (err) {
        if(err.name==="ValidationError")  setResultMessage({message:err.message,type:"bad"});
        else if (!err?.response) {
          setResultMessage({message:"No Server Response",type:"bad"});
        } 
        else {
          setResultMessage({message:"Playlist Update Failed",type:"bad"});
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
        fetchUserPlaylists();
        fetchUserLikedPlaylists();
    },[logoutMessage,userDelete,likesManager.likedPlaylistID]);

  return (
    <>
        {modalShow.state && <PopUpListModal modalShow={modalShow} setmodalShow={setmodalShow}/>}
      
      {(Array.isArray(ownPlaylists.message) && Array.isArray(likedPlaylists.message) && <BoxName>Playlists</BoxName>)}
      { resultMessage!=="" &&  <FormErrorMessage type={resultMessage.type}>
                  {resultMessage.message}
              </FormErrorMessage>}
      { likesManager.resultMessage!=="" &&  <FormErrorMessage type={likesManager.resultMessage.type}>
                  {likesManager.resultMessage.message}
              </FormErrorMessage>}
      <List>
        {
          Array.isArray(ownPlaylists.message) ?
            <div>
              <Head><HeadSpan>My Playlists</HeadSpan></Head>
              <Scroller>
                <button onClick={() => Scroll(userPlaylistsContainer)}><FaArrowAltCircleUp /></button>
              </Scroller>
              <ListContainer ref={userPlaylistsContainer} playlist>
                  {ownPlaylists.message.map((playlist)=>{
                    return <ListEntry key={"myplaylist_"+playlist.playlist_id} style={{marginTop:"0px"}}>
                              <Desc>
                                <DynamicTitle type="text" value={updateData.get(playlist.playlist_id) && updateData.get(playlist.playlist_id).playlist_name ? updateData.get(playlist.playlist_id).playlist_name : playlist.playlist_name} 
                                              onChange={(e)=> setUpdateData(map => new Map(map.set(playlist.playlist_id, {...map.get(playlist.playlist_id),playlist_name:e.target.value})) )}/>

                                <DynamicTitle type="text" value={updateData.get(playlist.playlist_id) && updateData.get(playlist.playlist_id).details ? updateData.get(playlist.playlist_id).details : playlist.details} 
                                              onChange={(e)=> setUpdateData(map => new Map(map.set(playlist.playlist_id, {...map.get(playlist.playlist_id),details:e.target.value})) )}/>
                                    
                                <DynamicTitle type="text" value={updateData.get(playlist.playlist_id) && updateData.get(playlist.playlist_id).tag ? updateData.get(playlist.playlist_id).tag : playlist.tag} 
                                              onChange={(e)=> setUpdateData(map => new Map(map.set(playlist.playlist_id, {...map.get(playlist.playlist_id),tag:e.target.value})) )}/>
                                <Body>

                                    <span> 
                                      {playlist.popularity} &nbsp;&nbsp;
                                      { <FaThumbsUp style={{color:likesManager.likedPlaylistID.has(playlist.playlist_id)?"blue":"white"}} 
                                        onClick={() => likesManager.likedPlaylistID.has(playlist.playlist_id) ? likesManager.unlike(playlist.playlist_id,"playlist") : likesManager.like(playlist.playlist_id,"playlist")} /> } 
                                    </span>
                                </Body>
                              </Desc>
                              <Time>
                                <Dates>{`${new Date(playlist.creation_date).toLocaleString()}`.split(',')[0]}</Dates>
                              </Time>
                              <ManipButtons>
                                <ActionButton color='green' onClick={() => setmodalShow({state:true,of:"playlist",id:playlist.playlist_id})}><FaFireExtinguisher /></ActionButton>
                                <ActionButton color='red' onClick={() => deletePlaylist(`${playlist.playlist_id}`)}><FaTrash /></ActionButton>
                                <ActionButton color='blue' onClick={() => updatePlaylist(`${playlist.playlist_id}`)}><FaPencilAlt /></ActionButton>
                              </ManipButtons>
                          </ListEntry>
                })}
              </ListContainer>
              <Scroller>
                <button onClick={() => Scroll(userPlaylistsContainer,false)}><FaArrowAltCircleDown /></button>
              </Scroller>
            </div>
            :
          <FormErrorMessage type={ownPlaylists.type}>
                  {ownPlaylists.message}
              </FormErrorMessage>
        }
        {
          Array.isArray(likedPlaylists.message) ?
            <div>
              <Head><HeadSpan>Liked Playlists</HeadSpan></Head>
              <Scroller>
                <button onClick={() => Scroll(likedPlaylistsContainer)}><FaArrowAltCircleUp /></button>
              </Scroller>
              <ListContainer ref={likedPlaylistsContainer} playlist>
                  {likedPlaylists.message.map((playlist)=>{
                  return <ListEntry key={"liked_playlist_"+playlist.playlist_id} style={{marginTop:"0px"}}>
                              <Desc>
                                <Title>{playlist.playlist_name}</Title>
                                <SubTitle>{playlist.details}</SubTitle>
                                <SubTitle>{playlist.tag}</SubTitle>
                                <Body>
                                    <span>{playlist.popularity} &nbsp;&nbsp;
                                        <FaThumbsUp style={{color:likesManager.likedPlaylistID.has(playlist.playlist_id)?"blue":"white"}} 
                                        onClick={() => likesManager.likedPlaylistID.has(playlist.playlist_id) ? likesManager.unlike(playlist.playlist_id,"playlist") : likesManager.like(playlist.playlist_id,"playlist")} />
                                    </span>
                                </Body>
                              </Desc>
                              <Time>
                                <Dates>{`${new Date(playlist.creation_date).toLocaleString()}`.split(',')[0]}</Dates>
                              </Time>
                              <ManipButtons>
                                <ActionButton color='green' onClick={() => setmodalShow({state:true,of:"playlist",id:playlist.playlist_id})}><FaFireExtinguisher /></ActionButton>
                              </ManipButtons>
                          </ListEntry>
                  })}
              </ListContainer>
              <Scroller>
                <button onClick={() => Scroll(likedPlaylistsContainer,false)}><FaArrowAltCircleDown /></button>
              </Scroller>
            </div>
            :
          <FormErrorMessage type={likedPlaylists.type}>
                  {likedPlaylists.message}
              </FormErrorMessage>
        }
      </List>		
    </>
  )
}

export default UserPlaylistList