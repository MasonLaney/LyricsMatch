import React, {useEffect, useState} from 'react';

function AutocompField ({name, label}) {

    // add variable data to the state
    const [artists, setArtists] = useState(["Aesop Rock", "Drake", "Eminem", "DMX", "Kanye West", "Kendrick Lamar", "A$AP Rocky"]);
    const [suggestions, setSuggestions] = useState([]);
    const [text, setText] = useState('');

    
    const onInputChange = function(event) {
        console.log(event.target.value);
        if (event.target.value.length === 0) {
            setSuggestions([]);
            setText('');
        } else {
            const expr = new RegExp(`^${event.target.value}`, 'i');
            const sugg = artists.sort().filter(a => expr.test(a));
            setSuggestions(sugg);
            setText(event.target.value);
        }
    }

    const onSuggestionSelection = function(value) {
        setText(value);
        setSuggestions([]);
    }

    const displaySuggestions = function() {
        if (suggestions.length === 0) {
            return null;
        }
        return(
            <ul>
                {suggestions.map((artist) => <li onClick={() => onSuggestionSelection(artist)}>{artist}</li>)}
            </ul>
        );
    }

    // components to render
    return (
        <div className="has-text-dark">
            
            <div><label htmlFor={name}>{label}</label></div>
            <input className="input" id={name} value={text} onChange={onInputChange} type="text"/>
            {displaySuggestions()}

        </div>
    )

}

export default AutocompField;