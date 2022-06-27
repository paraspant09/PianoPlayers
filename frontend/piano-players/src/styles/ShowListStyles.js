import styled from "styled-components";

export const BoxName=styled.h1`
  text-align: center;
  color: white;
`

export const List=styled.div`
  padding: 30px 0px;
  display: flex;
  justify-content: space-around;
`

export const Head=styled.div`
  background: black;
  margin-bottom: 3px;
  padding: 5px;
`
export const HeadSpan=styled.span`
  background: grey;
  padding: 2px 10px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  `

export const Scroller=styled.div`
  text-align: center;
  margin: 8px;
  & > button {
    all:unset;
    background: grey;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
  `
  
export const ListContainer=styled.div`
  height:${props => props.playlist?"480px":"338px"};
  overflow:hidden;
  `

export const ListEntry=styled.div`
  margin-bottom: 5px;
  padding-bottom: 5px;
  width:100%;
  color: white;
  border-bottom: 2px solid white;
  transition:0.5s all ease-out;
  `

export const Desc=styled.div`
  display: inline;
  width: 100%;
  font-size: 12px;
`

export const Title=styled.div`
  font-size: 18px;
  width:10em;
  margin-bottom: 4px;
  padding: 12px 10px;
`

export const SubTitle=styled.div`
  font-size: 15px;
  width:10em;
  margin-bottom: 5px;
  padding: 5px 10px;
`

export const DynamicTitle=styled.input`
  display: block;
  font-size: 18px;
  margin-bottom: 5px;
  padding-left:10px;
  height:30px;
  border-color: white;
  border-radius: 5px;
  background: grey;
  color: white;
  cursor: pointer;
`

export const Body=styled.div`
  padding: 0px 10px;
  display: flex;
  justify-content: space-between;
  & > span{
    cursor: pointer;
  }
`

export const Time=styled.div`
  display: inline-block;
  width: 100%;
  font-size: 12px;
  text-align: right;
`

export const Dates=styled.div`
  font-size: 18px;
  margin-bottom: 5px;
  padding: 10px 10px 10px 0;
`

export const ManipButtons=styled.div`
  display: flex;
  justify-content: space-around;
`

export const ActionButton=styled.button`
  all:unset;
  line-height:40px;
  width:40px;
  text-align: center;
  background: ${props => props.color};
  color: white;
  
  &:hover {
    width:43px;
    font-size:1.25rem;
  }
`