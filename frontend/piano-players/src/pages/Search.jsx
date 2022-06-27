import React, { useContext , useEffect, useState } from 'react'
import { FaFireExtinguisher, FaPlay, FaSearch, FaThumbsUp } from 'react-icons/fa'
import { useNavigate } from 'react-router';
import styled from 'styled-components'
import PopUpListModal from '../components/PopUpListModal';
import axios from '../constants/axios';
import { FormDropDown, FormErrorMessage } from '../styles/FormStyles'
import { ActionButton, ManipButtons } from '../styles/ShowListStyles';

import { LikesContext } from '../contexts/LikesState';
import PopUpAddSongToPlaylistModal from '../components/PopUpAddSongToPlaylistModal';

function Search() {
  const likesManager = useContext(LikesContext);

  const navigate=useNavigate();
  const [toSearch, settoSearch] = useState("song");
  const [whatToSearch, setwhatToSearch] = useState("");
  const [searchResult, setsearchResult] = useState({message:null,type:""});
  const [songModalShow, setsongModalShow] = useState({state:false,of:"",id:0});
  const [playlistModalShow, setplaylistModalShow] = useState({state:false,id:0});

  const fetchSearchData = async (pre,val) => {
      likesManager.setResultMessage({message:null,type:""});
      if(val.length<3){
        setsearchResult({message:"At least 3 Characters to search On.",type:"good"});
        settoSearch(pre);
        setwhatToSearch(val);
        return;
      }
      try {
          const response = await axios.get(
            `/search/${pre}/${val}`
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
            setsearchResult({message:"Search result Fetching Failed",type:"bad"});
          }
      }
      settoSearch(pre);
      setwhatToSearch(val);
  };

  useEffect(() => {
    return () => {
      likesManager.setResultMessage({message:null,type:""});
    }
     // eslint-disable-next-line
  }, [])
  

  return (
    <div>
      {/* {console.log(likesManager.likedSongsID)} */}
      {songModalShow.state && <PopUpListModal modalShow={songModalShow} setmodalShow={setsongModalShow}/>}
      {playlistModalShow.state && <PopUpAddSongToPlaylistModal modalShow={playlistModalShow} setmodalShow={setplaylistModalShow}/>}
      <Searcher>
        <SearchBar>
          <input type="text" name="whatToSearch" value={whatToSearch} onChange={(e)=> fetchSearchData(toSearch,e.target.value)} placeholder="Enter name of (Song/Playlist/Artist) you want to search on..." />
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          
        </SearchBar>
        <MyDropDown name="toSearch" value={toSearch} onChange={(e)=> fetchSearchData(e.target.value,whatToSearch)}>
            <option value="artist">Artist</option>
            <option value="song">Song</option>
            <option value="playlist">Playlist</option>
        </MyDropDown>  
      </Searcher>

      { likesManager.resultMessage!=="" &&  
        <FormErrorMessage type={likesManager.resultMessage.type}>
          {likesManager.resultMessage.message}
        </FormErrorMessage>}

      {(Array.isArray(searchResult.message) && searchResult.message.length>0) ?
        (()=>{
          if(toSearch==="song"){
            return <Container>
              {
                searchResult.message.map((song)=>{
                  const date=new Date(song.upload_date);
                  return <Card key={"Search_Song_"+song.song_id}>
                    <h3>{song.song_name}</h3>
                    <p>Upload Date : {date.getDate()}-{date.getMonth()}-{date.getFullYear()}</p>
                    <p>Popularity : {song.popularity}</p>
                    <span> 
                      {<FaThumbsUp style={{color:likesManager.likedSongsID.has(song.song_id)?"blue":"white"}} 
                        onClick={() => likesManager.likedSongsID.has(song.song_id) ? likesManager.unlike(song.song_id) : likesManager.like(song.song_id)} /> } 
                    </span>
                    <ManipButtons>
                      <ActionButton color='green' onClick={() => navigate('/',{state:song}) }><FaPlay /></ActionButton>
                      <ActionButton color='blue'  onClick={() => setplaylistModalShow({state:true,id:song.song_id})}><FaFireExtinguisher /></ActionButton>
                    </ManipButtons>
                  </Card>
                })
              }
            </Container>
          }
          else if(toSearch==="artist"){
            return <Container>
              {
                searchResult.message.map((artist)=>{
                  return <Card key={"Search_Artist_"+artist.user_id}>
                    <h3>{artist.fname} {artist.lname??""}</h3>
                    <p>BIO : {artist.bio}</p>
                    <p>Popularity : {artist.popularity}</p>
                    <p>Gender : {artist.gender==="M"?"Male":(artist.gender==="F"?"Female":"Others")}</p>
                    <p>Country : {artist.country_code}</p>
                    <span> 
                      {<FaThumbsUp style={{color:likesManager.likedArtistsID.has(artist.user_id)?"blue":"white"}} 
                        onClick={() => likesManager.likedArtistsID.has(artist.user_id) ? likesManager.unlike(artist.user_id,"artist") : likesManager.like(artist.user_id,"artist")} /> } 
                    </span>
                    <ManipButtons>
                      <ActionButton color='green'  onClick={() => setsongModalShow({state:true,of:"artist",id:artist.user_id})}><FaFireExtinguisher /></ActionButton>
                    </ManipButtons>
                  </Card>
                })
              }
            </Container>
          }
          else if(toSearch==="playlist"){
            return <Container>
              {
                searchResult.message.map((playlist)=>{
                  const date=new Date(playlist.creation_date);
                  return <Card key={"Search_Playlist_"+playlist.playlist_id}>
                    <h3>{playlist.playlist_name}</h3>
                    <p>Creation Date : {date.getDate()}-{date.getMonth()}-{date.getFullYear()}</p>
                    <p>Popularity : {playlist.popularity}</p>
                    <p>Details : {playlist.details}</p>
                    <p>Tag : {playlist.tag}</p>
                    <span> 
                      {<FaThumbsUp style={{color:likesManager.likedPlaylistID.has(playlist.playlist_id)?"blue":"white"}} 
                        onClick={() => likesManager.likedPlaylistID.has(playlist.playlist_id) ? likesManager.unlike(playlist.playlist_id,"playlist") : likesManager.like(playlist.playlist_id,"playlist")} /> } 
                    </span>
                    <ManipButtons>
                      <ActionButton color='green' onClick={() => setsongModalShow({state:true,of:"playlist",id:playlist.playlist_id})}><FaFireExtinguisher /></ActionButton>
                    </ManipButtons>
                  </Card>
                })
              }
            </Container>
          }
        })()
        :
        (!Array.isArray(searchResult.message) ? 
        <FormErrorMessage>{searchResult.message??"At least 3 Characters to search On."}</FormErrorMessage> : 
        <FormErrorMessage>Sorry,Nothing found out..</FormErrorMessage>)
        
      }
    </div>
  )
}

const Searcher=styled.div`
  display: flex;
  justify-content: space-around;
  margin: 30px 0px;
  @media only screen and (max-width: 728px) {
    display: block;
    text-align: center;
  }
`

const SearchBar=styled.div`
  background: #fff;
  width: 80%;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 1px 5px 3px rgba(0, 0, 0, 0.12);

  & > input {
    height: 55px;
    width: 85%;
    outline: none;
    border: none;
    border-radius: 5px;
    padding: 0 60px 0 20px;
    font-size: 18px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);

    &:active{
      border-radius: 5px 5px 0 0;
    }
  }

  @media only screen and (max-width: 728px) {
    margin: 50px auto;
  }
`

const SearchIcon=styled.div`
  font-size: 20px;
  color: #3a0ca3;
  padding: 10px;
  cursor: pointer;
`

const MyDropDown=styled(FormDropDown)`
  width: 15%;
  margin: 10px;
  @media only screen and (max-width: 728px) {
    display:block;
    margin: 50px auto;
    width: 100px;
  }
`

const Container=styled.div`
  display: grid;
  grid-template-columns: auto auto auto;

  @media only screen and (max-width: 728px) {
    display: block;
  }
`

const Card=styled.div`
  background-color: lightgrey;
  margin: 50px auto;
  max-width: fit-content;
  padding: 5px;
`

export default Search