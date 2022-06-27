import styled from "styled-components"

export const Modal=styled.div`
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
`
  
export const ModalContent=styled.div`
    background-color: #fefefe;
    margin: 8% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 40%;
`

export const ModalTitle=styled.h2`
    margin: 20px 0px;
    text-align: center;
`

export const ModalInnerList=styled.div`
    overflow:auto;
    max-height:314px;
    margin:10px;
`
  
export const ModalClose=styled.span`
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;

    &:hover,:focus{
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
`