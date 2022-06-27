import React, { useEffect, useState } from 'react'
import { FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import axios from '../constants/axios';
import { FormErrorMessage } from '../styles/FormStyles';
import { ModalClose, Modal, ModalContent, ModalInnerList, ModalTitle } from '../styles/PopUpModalStyles';
import { ActionButton, ManipButtons } from '../styles/ShowListStyles';

function PopUpListModal({modalShow,setmodalShow}) {
    const [searchResult, setsearchResult] = useState({message:null,type:""});
    const navigate=useNavigate();
    
    useEffect(() => {
        const fetchListData = async (SearchString) => {
            try {
                const response = await axios.get(
                    SearchString
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
        };

        if(modalShow.of === "artist"){
            fetchListData(`/details/songs/${modalShow.id}`);
        }
        else if(modalShow.of === "playlist"){
            fetchListData(`/details/all/songs/${modalShow.id}`);
        }
      
    }, [modalShow])
    
    
  return (
    <Modal>
        <ModalContent>
            <ModalClose onClick={()=> setmodalShow({state:false,of:"",id:0})}>&times;</ModalClose>
            <ModalTitle>{modalShow.of} no. {modalShow.id} Songs</ModalTitle>
            <hr />
            <ModalInnerList>

                { Array.isArray(searchResult.message) ? searchResult.message.map((data)=>{
                        const date=new Date(data.upload_date);
                    return <div style={{marginBottom:"50px"}} key={"List_Song_"+data.song_id}>
                        <h3>{data.song_name}</h3>
                        <p>Upload Date : {date.getDate()}-{date.getMonth()}-{date.getFullYear()}</p>
                        <p>Popularity : {data.popularity}</p>
                        <ManipButtons>
                            <ActionButton color='green' onClick={() => navigate('/',{state:data}) }><FaPlay /></ActionButton>
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

export default PopUpListModal