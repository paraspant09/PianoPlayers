import React, { useState } from 'react'
import { useLocation } from 'react-router';
import Piano from '../components/Piano'
import Player from '../components/Player';
import Recorder from '../components/Recorder'

function Home() {
  const [playingNote , setPlayingNote]=useState([""]);
  const location=useLocation();
  return (
    <>
      <Piano playingNote={playingNote} setPlayingNote={setPlayingNote} />
      { location.state===null ? 
        <Recorder playingNote={playingNote}/>
        : <Player setPlayingNote={setPlayingNote} />}
    </>
  )
}

export default Home