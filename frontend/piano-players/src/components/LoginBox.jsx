import React, { useContext, useState } from 'react'
import {Form,FormBody,FormBoxEnd,FormErrorMessage,FormInput,FormInputField,FormLabel} from '../styles/FormStyles'
import { Formik } from "formik";
import * as Yup from 'yup';
import axios from '../constants/axios';
import { LikesContext } from '../contexts/LikesState';

function LoginBox() {
    const likesManager = useContext(LikesContext);
  
    const [resultMessage,setResultMessage]=useState({message:"",type:""});
  const initialValues = {
      email: "",
      password: ""
  };
  
  const validateSchema = Yup.object().shape({
      email: Yup.string().max(50,"Must be less than 50 chars.").email("Must be valid email.").required("Email is required"),
      password: Yup.string()
          .required("Password is required")
          .min(8, "Password is too short - should be 8 chars minimum")
          .max(255, "Password is too long - should be 255 chars maximum")
  });

  const submitForm = async (values) => {
      try {
          const response = await axios.post(
            '/auth/login',
            JSON.stringify(values),
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
          }
          else {
              setResultMessage({message:"Login Failed",type:"bad"});
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
                              <FormLabel htmlFor="email">Email </FormLabel>
                              <FormInput  type="email" id="user_email" name="email" value={values.email} onChange={handleChange} error={touched.email && errors.email} placeholder="Email"/>
                          </FormInputField>
                              {touched.email && errors.email && <FormErrorMessage type="bad">{errors.email}</FormErrorMessage>}
                          <FormInputField>
                              <FormLabel htmlFor="password">Password </FormLabel>
                              <FormInput type="password" id="user_password" name="password" value={values.password} onChange={handleChange} error={touched.password && errors.password} placeholder="Password"/>
                          </FormInputField>
                              {touched.password && errors.password && <FormErrorMessage type="bad">{errors.password}</FormErrorMessage>}
                      </FormBody>
                      <FormBoxEnd>
                          <button type="submit">LogIn</button>
                      </FormBoxEnd>
                  </Form>
              );
             }
         }
     </Formik>
  )       
}

export default LoginBox