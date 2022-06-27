import styled from "styled-components";

export const Form=styled.form`
    box-shadow: 8px 8px 16px 0 rgba(0, 0, 0, 0.2), -8px -8px 12px 0 rgba(255, 255, 255, 0.12);
    width: 500px;
    height: auto;
    margin:50px auto;
    border-radius:5px;
    border-style:solid;
    border-color:grey;
`
export const FormBody=styled.div`
    border-radius:20px;
    user-select: none;
    padding: 20px 10px;
    & > *{
        padding: 5px;
    }
`
export const FormInputField=styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const FormLabel=styled.label`
    color: white;
    width: 40%;
`

export const FormInput=styled.input`
    padding-left:10px;
    width:60%;
    height:30px;
    border-radius: 5px;
    border: ${props => props.error?"2px solid red":""};
`

export const FormTextArea=styled.textarea`
    padding-left:10px;
    width:60%;
    height:50px;
    border-radius: 5px;
    border: ${props => props.error?"2px solid red":"2px solid #000"};
    resize:none;
`
export const FormDropDown=styled.select`
    padding-left:10px;
    width:64%;
    height:35px;
    border-radius: 5px;
    border: ${props => props.error?"2px solid red":"2px solid #000"};
`

export const FormErrorMessage=styled.p`
    text-align:center;
    color:rgb(255, 255, 255);
    text-shadow:5px 5px 8px ${props => props.type==="good"?"green":"red"};
    border-radius: 5px;
    margin-bottom:10px;
`

export const FormBoxEnd=styled.div`
    text-align: center;
    margin-bottom: 20px;
    & > *{
        width:50%;
        height:40px;
        background-color:black;
        color:white;
        border-radius: 5px;
        &:hover{
            background-color:white;
            color:black;
        }
    }
`
