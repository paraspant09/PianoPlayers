import React, { useEffect } from 'react'
import styled from 'styled-components'
import keyBoardToNoteMapper from '../constants/keyBoardToNoteMapper';

function Piano({playingNote,setPlayingNote}) {
    //Playing note is array of one string because of handling same key press multiple times
    //To make useEffect call every time a key press whether same key is pressed 

    const onKeyPressedHandler = (e) => {
        const note=keyBoardToNoteMapper[e.keyCode];
        if(keyBoardToNoteMapper[e.keyCode]!==undefined){
            setPlayingNote([note]);
        }
    };

    useEffect(() => {
        if(playingNote[0]!==""){
            const bleep=new Audio(`${process.env.PUBLIC_URL + '/piano_notes/' +playingNote+'.mp3'}`);
            bleep.currenttime=0;
            bleep.play();
        }
    },[playingNote]);

  return (
    <PianoBody onKeyDown={onKeyPressedHandler}>
        <SpeakerImage />
        <DashboardImage />
        <SpeakerImage />
        <Keys>
        {
                [2, 3, 4, 5].map((group) => {
                    return ([
                        group!==2?
                        <LowerKeys key={`C${group}`} id={`C${group}`} onMouseDown={() => setPlayingNote([`C${group}`])} adjacent ></LowerKeys>
                        :<LowerKeys key={`C${group}`} id={`C${group}`} onMouseDown={() => setPlayingNote([`C${group}`])} ></LowerKeys>,
                        <UpperKeys key={`C${group}s`} id={`C${group}s`} onMouseDown={() => setPlayingNote([`C${group}s`])}></UpperKeys>,
                        <LowerKeys key={`D${group}`} id={`D${group}`} onMouseDown={() => setPlayingNote([`D${group}`])} right></LowerKeys>,
                        <UpperKeys key={`D${group}s`} id={`D${group}s`} onMouseDown={() => setPlayingNote([`D${group}s`])}></UpperKeys>,
                        <LowerKeys key={`E${group}`} id={`E${group}`} onMouseDown={() => setPlayingNote([`E${group}`])} right></LowerKeys>,
                        <LowerKeys key={`F${group}`} id={`F${group}`} onMouseDown={() => setPlayingNote([`F${group}`])} adjacent></LowerKeys>,
                        <UpperKeys key={`F${group}s`} id={`F${group}s`} onMouseDown={() => setPlayingNote([`F${group}s`])}></UpperKeys>,
                        <LowerKeys key={`G${group}`} id={`G${group}`} onMouseDown={() => setPlayingNote([`G${group}`])} right></LowerKeys>,
                        <UpperKeys key={`G${group}s`} id={`G${group}s`} onMouseDown={() => setPlayingNote([`G${group}s`])}></UpperKeys>,
                        <LowerKeys key={`A${group}`} id={`A${group}`} onMouseDown={() => setPlayingNote([`A${group}`])} right></LowerKeys>,
                        <UpperKeys key={`A${group}s`} id={`A${group}s`} onMouseDown={() => setPlayingNote([`A${group}s`])}></UpperKeys>,
                        <LowerKeys key={`B${group}`} id={`B${group}`} onMouseDown={() => setPlayingNote([`B${group}`])} right></LowerKeys>
                    ])
                })
            }            
        </Keys>
      </PianoBody>
  )
}

const PianoBody=styled.div`
    width: 951px;
    height: 270px;
    border-radius: 10px;
    background-image: linear-gradient(to bottom,black 50%,#595653);
    margin: 40px auto;
  
    display: grid;
    grid-template-columns:repeat(3,33.3%);
`;

const DashboardImage=styled.div`
    width:295px; /*895/3 -3(due to 3 margins)*/
    height: 70px;      /*(270-180)-20*/
    margin: auto;
    margin-top: 10px;

    border-radius: 5px;
    background-image: url(${process.env.PUBLIC_URL + '/piano_related_img/PianoDashboardIMage.png'});
`;

const SpeakerImage=styled.div`
    width:255px;
    height: 70px;      /*(270-180)-20*/
    margin: auto;
    margin-top: 10px;

    background-image: url(${process.env.PUBLIC_URL + '/piano_related_img/PianoSpeakerImage.png'});
`;
  
const Keys=styled.div`
    background-color: black;
    display: flex;
    /* justify-content: space-between; */
    width: 95%;
    height: 180px;
    margin: auto;
  
    grid-column-start: 1;
    grid-column-end: 4;
`;
const LowerKeys=styled.button`
    all:unset;
    width: 35px;
    height: inherit;
    background-color: white;
    box-shadow: 0px 7px 5px black;
    z-index: 1;
    margin-left: ${props => props.right ? -10 : (props.adjacent ? 2 : 0)}px;
    &:hover{
        background-color: #dbd3c8;
    }
    &:active{
        background-image: linear-gradient(to bottom,white,#7d7872);
        box-shadow: 0px 0px 5px black;
    }
`;
const UpperKeys=styled.button`
    all:unset;
    width: 30px;
    height: 110px;
    background-image: linear-gradient(to bottom,black,#616161);
    border-color: lightgrey;
    box-shadow: 0px 7px 5px black;
    margin-left: -14px;
    z-index: 2;
    &:hover{
        background-image: linear-gradient(to bottom,#4f4d4a,#616161);
    }
    &:active{
        background-image: linear-gradient(to bottom,#616161,#242322);
        box-shadow: 0px 5px 5px #403a34;
    }
`;

export default Piano