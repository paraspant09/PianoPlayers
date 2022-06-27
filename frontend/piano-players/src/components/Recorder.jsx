import React, { useEffect, useState } from 'react'
import {Form,FormBody,FormDropDown,FormErrorMessage,FormInput,FormInputField,FormLabel} from '../styles/FormStyles'
import { FaPause, FaPlay, FaSave } from 'react-icons/fa';
import styled from 'styled-components'
import { ActionButton } from '../styles/ShowListStyles';
import { Formik } from "formik";
import * as Yup from 'yup';
import axios from '../constants/axios';

function Recorder({ playingNote }) {
    const [isRecord,setIsRecord]=useState({startTime:null,status:false});
    const [songRecord,setSongRecord]=useState([]);
    const [resultMessage,setResultMessage]=useState({message:"",type:""});

    const setRecordStatus=()=>{
        if(isRecord.status) setSongRecord([]);
        setIsRecord(prevStatus => ({...prevStatus,
            status:!prevStatus.status,
            startTime:(!prevStatus.status)? new Date().getTime() : null
        }));
    }
    
    useEffect(()=>{
        if(isRecord.status)    setSongRecord(prevSong => [...prevSong, `${(new Date().getTime())-isRecord.startTime}:${playingNote}`]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[playingNote]);

    const initialValues = {
        song_name:"",
        status:"PRI"
    };
    
    const validateSchema = Yup.object().shape({
        song_name: Yup.string().matches(/^([a-zA-Z]+\s?)+$/,"Song name must be words with space between.").required("Song Name is required")
                .min(3,"Should be 3 chars minimum").max(50,"Should be 50 chars maximum"),
        status: Yup.string().required("Status is required")
    });

    const songSave = async (values) => {
        if(!isRecord.status)   return;

        try {
            for (const prop in values) {
                if(values[prop]==="") values[prop]=null;
            }
            const response = await axios.post(
              '/user/song',
              JSON.stringify({...values,song:songRecord.toString()}),
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
            setResultMessage({message:response.data.message,type:"good"});
        } catch (err) {
            if (!err?.response) {
                setResultMessage({message:"No Server Response",type:"bad"});
            }
            else {
                setResultMessage({message:"Fetch Song Failed",type:"bad"});
            }
        }
    };

  return (
    <RecordBox>
        <ActionButton color='green' onClick={() => setRecordStatus()}>{isRecord.status?<FaPause />:<FaPlay />}</ActionButton>
        {
            isRecord.status &&
            <Formik
                initialValues={initialValues}
                validationSchema={validateSchema}
                onSubmit={songSave}
                >
                {
                    ({values,handleChange,handleSubmit,errors,touched})=>{
                        return(
                            <Form onSubmit={handleSubmit}>
                                <FormBody>
                                    {resultMessage.message!=="" && <FormErrorMessage type={resultMessage.type}>{resultMessage.message}</FormErrorMessage> }
                                    <FormInputField>
                                        <FormLabel htmlFor="song_name">Song Name </FormLabel>
                                        <FormInput type="text" id="song_name" name="song_name" value={values.song_name} onChange={handleChange} error={touched.song_name && errors.song_name} placeholder="Song Name"/>
                                    </FormInputField>
                                        {touched.song_name && errors.song_name && <FormErrorMessage type="bad">{errors.song_name}</FormErrorMessage>}
                                    <FormInputField>
                                        <FormLabel htmlFor="status">Status </FormLabel>
                                        <FormDropDown id="status" name="status" value={values.status} onChange={handleChange} error={touched.status && errors.status}>
                                            <option value="PRI">PRIVATE</option>
                                            <option value="PUB">PUBLIC</option>
                                        </FormDropDown>
                                    </FormInputField>
                                        {touched.status && errors.status && <FormErrorMessage type="bad">{errors.status}</FormErrorMessage>}
                                </FormBody>
                                <ActionButton type="submit" color='red' style={{ marginBottom : "8px" }}><FaSave /></ActionButton>
                            </Form>
                        );
                    }
                }
            </Formik>
        }
    </RecordBox>
  )
}

const RecordBox=styled.div`
    text-align: center;
`



export default Recorder