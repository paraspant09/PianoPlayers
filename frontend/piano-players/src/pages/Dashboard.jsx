import React, { useState } from 'react'
import CreateAPlaylistCard from '../components/CreateAPlaylistCard';
import LogoutBox from '../components/LogoutBox';
import UserDeleteBox from '../components/UserDeleteBox';
import UserDetailsCard from '../components/UserDetailsCard';
import UserPlaylistList from '../components/UserPlaylistList';
import UserSongsList from '../components/UserSongsList';

function Dashboard() {
  const [logoutMessage,setLogoutMessage]=useState({message:"",type:""});
  const [userDelete,setUserDelete]=useState({message:"",type:""});
  const [editDetails,setEditDetails]=useState(false);
  const [songsList,setSongsList]=useState(false);
  const [playlistList,setPlaylistList]=useState(false);
  const [createPlaylist,setCreatePlaylist]=useState(false);

  return (
    <div>
      <LogoutBox logoutMessage={logoutMessage} setLogoutMessage={setLogoutMessage}/>
      <UserDeleteBox userDelete={userDelete} setUserDelete={setUserDelete}/>
      <button onClick={() => setEditDetails(e => !e)}>{ !editDetails ? "Show Edit Details" : "Hide Submit Edits"}</button>
      <br/>
      <br/>
      {editDetails && <UserDetailsCard logoutMessage={logoutMessage} userDelete={userDelete} />}
      <button onClick={() => setSongsList(e => !e)}>{ !songsList ? "Show Songs List" : "Hide Songs List"}</button>
      <br/>
      <br/>
      {songsList && <UserSongsList logoutMessage={logoutMessage} userDelete={userDelete} />}
      <button onClick={() => setPlaylistList(e => !e)}>{ !playlistList ? "Show playlist List" : "Hide playlist List"}</button>
      <br/>
      <br/>
      {playlistList && <UserPlaylistList logoutMessage={logoutMessage} userDelete={userDelete} />}
      <button onClick={() => setCreatePlaylist(e => !e)}>{ !createPlaylist ? "Show create playlist" : "Hide create playlist"}</button>
      <br/>
      <br/>
      {createPlaylist && <CreateAPlaylistCard />}
    </div>
  )
}

export default Dashboard