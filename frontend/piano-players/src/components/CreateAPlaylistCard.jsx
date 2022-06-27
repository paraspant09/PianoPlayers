import React, { useState } from 'react'
import {Form,FormBody,FormBoxEnd,FormErrorMessage,FormInput,FormInputField,FormLabel} from '../styles/FormStyles'
import { Formik } from "formik";
import * as Yup from 'yup';
import axios from '../constants/axios';

function CreateAPlaylistCard() {
    const [resultMessage,setResultMessage]=useState({message:"",type:""});

    const initialValues = {
        playlist_name:"",
        details:"",
        tag: ""
    };
    
    const validateSchema = Yup.object().shape({
        playlist_name: Yup.string().trim().matches(/^([a-zA-Z]+\s?)+$/,"Playlist Name must be words with space between").required("Playlist Name is required")
                .min(3,"Should be 3 chars minimum").max(50,"Should be 50 chars maximum"),
        details: Yup.string().trim().matches(/^[a-zA-Z\s]+.$/,"Playlist details must be words with space between( can be ended with full stop )").required("Playlist details is required")
                .min(5,"Should be 5 chars minimum").max(255,"Should be 255 chars maximum"),
        tag: Yup.string().matches(/^#[a-zA-Z0-9(_)]+$/,"Playlist tag must be hashtags with or without underscores alphabet or numbers").required("Playlist tag is required")
                .min(3,"Should be 3 chars minimum").max(30,"Should be 30 chars maximum")
    });

    const submitForm = async (reqData) => {
        try {
            for (const prop in reqData) {
                if(reqData[prop]==="") reqData[prop]=null;
            }
            const response = await axios.post(
              '/user/playlist',
              JSON.stringify(reqData),
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
                setResultMessage({message:"Updation Failed",type:"bad"});
            }
        }
    };

  return (
    <div>
        {
            <Formik
                initialValues={initialValues}
                validationSchema={validateSchema}
                onSubmit={submitForm}
                >
                {
                    ({values,handleChange,handleSubmit,errors,touched})=>{
                        return(
                            <Form onSubmit={handleSubmit}>
                                <FormBody>
                                    {resultMessage.message!=="" && <FormErrorMessage type={resultMessage.type}>{resultMessage.message}</FormErrorMessage> }
                                    <FormInputField>
                                        <FormLabel htmlFor="playlist_name">Playlist Name </FormLabel>
                                        <FormInput type="text" id="playlist_name" name="playlist_name" value={values.playlist_name} onChange={handleChange} error={touched.playlist_name && errors.playlist_name} placeholder="Playlist Name"/>
                                    </FormInputField>
                                        {touched.playlist_name && errors.playlist_name && <FormErrorMessage type="bad">{errors.playlist_name}</FormErrorMessage>}
                                    <FormInputField>
                                        <FormLabel htmlFor="details">Playlist Details </FormLabel>
                                        <FormInput  type="text" id="details" name="details" value={values.details} onChange={handleChange} error={touched.details && errors.details} placeholder="Playlist details"/>
                                    </FormInputField>
                                        {touched.details && errors.details && <FormErrorMessage type="bad">{errors.details}</FormErrorMessage>}
                                    <FormInputField>
                                        <FormLabel htmlFor="tag">Playlist tag </FormLabel>
                                        <FormInput  type="text" id="tag" name="tag" value={values.tag} onChange={handleChange} error={touched.tag && errors.tag} placeholder="Playlist tag"/>
                                    </FormInputField>
                                        {touched.tag && errors.tag && <FormErrorMessage type="bad">{errors.tag}</FormErrorMessage>}
                                </FormBody>
                                <FormBoxEnd>
                                    <button type="submit">Create Playlist</button>
                                </FormBoxEnd>
                            </Form>
                        );
                    }
                }
            </Formik>
        }
    </div>
  )
}

export default CreateAPlaylistCard