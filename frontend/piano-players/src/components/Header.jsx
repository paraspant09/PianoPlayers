import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header>
        <Navbar>
            <Logo>
                <NavLink to="/"> Piano Players </NavLink>
            </Logo>
            <div>
                <HeaderLink to="/search"> Search </HeaderLink>
                <HeaderLink to="/dashboard">  Dashboard </HeaderLink>
                <HeaderLink to="/about">  About </HeaderLink>
                <HeaderLink to="/contact"> Contact Us </HeaderLink>
                <HeaderLink to="/signin"> Sign In </HeaderLink>
            </div>
        </Navbar>
    </header>
  )
}

const Navbar=styled.div`
    background-color: black;
    width:100%;
    height:80px;
    color:white;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
`;

const Logo=styled.div`
    font-size:30px;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-style: italic;
    padding: 0px 10px;
    height:80px;
    line-height: 80px;
    a{
        all:unset;
    }
`;

const HeaderLink=styled(NavLink)`
    all:unset;
    text-align:center;
    margin:0px auto;
    padding: 0px 10px;
    height:80px;
    line-height: 80px;
    color:white;
    font-size:20px;
    &:hover{
        background-color:white;
        color: black;
    }
`;

export default Header