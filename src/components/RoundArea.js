import React, {useEffect, useState} from 'react';

function RoundArea ({artists, n, songInfo, callback}) {
    
    // handle guess
    const handleGuess = async function(event, num) { 

        // prevent page from refreshing
        event.preventDefault();

        // determine correctness of guess
        const correct = songInfo.artistNum === num;
        let result = <div></div>;
        
        // if guess was correct
        if (correct) {
            result = <div className="has-text-dark has-text-centered m-5">
                <p className="is-size-4 has-text-weight-medium">Correct!</p>
                <p className="is-size-5 has-text-weight-normal">Lyrics are from {songInfo.title} by {artists[songInfo.artistNum]}</p>
                <br/>
                <p className="is-size-5 has-text-weight-medium is-italic has-text-warning">Loading the next round...</p>
            </div>
        }
        // if guess was incorrect
        else {
            result = <div className="has-text-dark has-text-centered m-5">
                <p className="is-size-4 has-text-weight-medium">Incorrect.</p>
                <p className="is-size-5 has-text-weight-normal">Lyrics are from {songInfo.title} by {artists[songInfo.artistNum]}</p>
                <br/>
                <p className="is-size-5 has-text-weight-medium is-italic has-text-warning">Loading the next round...</p>
            </div>
        }

        // display whether the user was correct or not
        setBody(result);

        // use callback function to update score
        await callback(correct);

    }

    // variable components
    const buttonTemplate = <form className="mt-5">
        <div className="columns">
            <div className="column"></div>
            <div className="column has-text-centered">
                <button className="button is-warning is-large is-fullwidth" onClick={e => handleGuess(e, 0)}>{artists[0]}</button>
            </div>
            <div className="column has-text-centered">
                <button className="button is-warning is-large is-fullwidth" onClick={e => handleGuess(e, 1)}>{artists[1]}</button>
            </div>
            <div className="column"></div>
        </div>
        <div className="columns">
            <div className="column"></div>
            <div className="column has-text-centered">
                <button className="button is-warning is-large is-fullwidth" onClick={e => handleGuess(e, 2)}>{artists[2]}</button>
            </div>
            <div className="column has-text-centered">
                <button className="button is-warning is-large is-fullwidth" onClick={e => handleGuess(e, 3)}>{artists[3]}</button>
            </div>
            <div className="column"></div>
        </div>
    </form>

    // add variable data to the state
    const [body, setBody] = useState(buttonTemplate);
    const [lyrics, setLyrics] = useState("");

    // restore default setup on render
    useEffect(async () => {
        setBody(buttonTemplate);
    }, []);

    // components to render
    return (
        <div className="has-text-dark">

            <div>
                <p className="has-text-dark is-size-5 has-text-centered m-5 has-text-weight-normal is-italic">"{songInfo.lyrics}"</p>
            </div>

            {body}

        </div>
    )
}

export default RoundArea;
