import React,{useContext, useState} from 'react'
import {Form,FormBody,FormBoxEnd,FormDropDown,FormErrorMessage,FormInput,FormInputField,FormLabel,FormTextArea} from '../styles/FormStyles'
import { Formik } from "formik";
import * as Yup from 'yup';
import axios from '../constants/axios';
import countryCodes from '../constants/countryCodes'
import { LikesContext } from '../contexts/LikesState';

function SignUpBox() {
    const likesManager = useContext(LikesContext);
    const [resultMessage,setResultMessage]=useState({message:"",type:""});
    const initialValues = {
        fname:"",
        lname:"",
        email: "",
        password: "",
        confirmPassword:"",
        bio:"",
        country_code:"ABW",
        gender:"M"
    };
    
    const validateSchema = Yup.object().shape({
        fname: Yup.string().matches(/^[a-zA-Z0-9]+$/,"First Name must be alphanumeric").required("First Name is required")
                .min(3,"Should be 3 chars minimum").max(100,"Should be 100 chars maximum"),
        lname: Yup.string().matches(/^[a-zA-Z0-9]+$/,"Last Name must be alphanumeric")
                .min(3,"Should be 3 chars minimum").max(100,"Should be 100 chars maximum"),
        email: Yup.string().max(50,"Should be 50 chars maximum").email("Should be valid email").required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password is too short - should be 8 chars minimum")
            .max(255, "Password is too long - should be 255 chars maximum"),
        confirmPassword: Yup.string().oneOf([
            Yup.ref('password'),''],
            'Passwords must match').required('Confirm Password is required'),
        bio: Yup.string().trim().min(10,"Should be 10 chars minimum").max(230,"Should be 230 chars maximum"),
        country_code: Yup.string().required("Country Code is required"),
        gender: Yup.string().required("Gender is required")
    });

    const submitForm = async (values) => {
        let {confirmPassword, ...reqData} = values;
        try {
            for (const prop in reqData) {
                if(reqData[prop]==="") reqData[prop]=null;
            }
            const response = await axios.post(
              '/auth/register',
              JSON.stringify(reqData),
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
            setResultMessage({message:response.data.message,type:"good"});
            likesManager.fetchUserLikedThings();
        } catch (err) {
            if (!err?.response) {
                setResultMessage({message:"No Server Response",type:"bad"});
            } else if (err.response?.status === 409) {
                setResultMessage({message:"Username Taken",type:"bad"});
            } else {
                setResultMessage({message:"Registration Failed",type:"bad"});
            }
        }
    };

    return(
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
                                <FormLabel htmlFor="fname">First Name </FormLabel>
                                <FormInput type="text" id="fname" name="fname" value={values.fname} onChange={handleChange} error={touched.fname && errors.fname} placeholder="First Name"/>
                            </FormInputField>
                                {touched.fname && errors.fname && <FormErrorMessage type="bad">{errors.fname}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="lname">Last Name </FormLabel>
                                <FormInput  type="text" id="lname" name="lname" value={values.lname} onChange={handleChange} error={touched.lname && errors.lname} placeholder="Last Name"/>
                            </FormInputField>
                                {touched.lname && errors.lname && <FormErrorMessage type="bad">{errors.lname}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="email">Email </FormLabel>
                                <FormInput  type="email" id="email" name="email" value={values.email} onChange={handleChange} error={touched.email && errors.email} placeholder="Email"/>
                            </FormInputField>
                                {touched.email && errors.email && <FormErrorMessage type="bad">{errors.email}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="password">Password </FormLabel>
                                <FormInput type="password" id="password" name="password" value={values.password} onChange={handleChange} error={touched.password && errors.password} placeholder="Password"/>
                            </FormInputField>
                                {touched.password && errors.password && <FormErrorMessage type="bad">{errors.password}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="confirmPassword">Confirm Password </FormLabel>
                                <FormInput type="password" id="confirmPassword" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} error={touched.confirmPassword && errors.confirmPassword} placeholder="Confirm Password"/>
                            </FormInputField>
                                {touched.confirmPassword && errors.confirmPassword && <FormErrorMessage type="bad">{errors.confirmPassword}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="bio">BIO </FormLabel>
                                <FormTextArea  id="bio" name="bio" value={values.bio} onChange={handleChange} error={touched.bio && errors.bio} placeholder="BIO"/>
                            </FormInputField>
                                {touched.bio && errors.bio && <FormErrorMessage type="bad">{errors.bio}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="country_code">Country Code</FormLabel>
                                <FormDropDown id="country_code" name="country_code" value={values.country_code} onChange={handleChange} error={touched.country_code && errors.country_code}>
                                    {
                                        countryCodes.map((codes)=>{
                                            return (
                                                <option key={codes[0]} value={codes[0]}>({codes[0]}) {codes[1]}</option>
                                            );
                                        })
                                    }
                                </FormDropDown>
                            </FormInputField>
                                {touched.country_code && errors.country_code && <FormErrorMessage type="bad">{errors.country_code}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="gender">Gender </FormLabel>
                                <FormDropDown id="gender" name="gender" value={values.gender} onChange={handleChange} error={touched.gender && errors.gender}>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Others</option>
                                </FormDropDown>
                            </FormInputField>
                                {touched.gender && errors.gender && <FormErrorMessage type="bad">{errors.gender}</FormErrorMessage>}
                        </FormBody>
                        <FormBoxEnd>
                            <button type="submit">Register</button>
                        </FormBoxEnd>
                    </Form>
                );
               }
           }
       </Formik>
    )       
}

export default SignUpBox