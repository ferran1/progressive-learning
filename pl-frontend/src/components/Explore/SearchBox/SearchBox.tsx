import React from 'react';

const SearchBox = (props) =>{
    return(
        <input type='search'
               className='center-searchBar'
               placeholder={props.placeholder}
               onChange ={props.handleChange}
        />
    )
}

export default SearchBox;

