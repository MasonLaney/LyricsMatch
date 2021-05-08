import React from 'react';
import AutocompField from './AutocompField.js';

function ArtistSelectionArea ({onSubmit}) {

    // handle artist selection submission
    const handleSubmit = function(event) {
        
        // prevent page from refreshing
        event.preventDefault();

        // create array out of artist values
        const out = [event.target.artist1.value, event.target.artist2.value, event.target.artist3.value, event.target.artist4.value];

        // if artist values are provided for all four fields, pass them to the callback
        if (out[0] !== "" && out[1] !== "" && out[2] !== "" && out[3] !== "") {
            onSubmit(out);
        }

    }

    // components to render
    return (
        <div className="has-text-dark has-text-weight-medium is-size-5">

            <form onSubmit={handleSubmit}>

                <div className="columns">
                    <div className="column"></div>
                    <div className="column has-text-centered">
                        <AutocompField name="artist1" label="Artist 1"/>
                    </div>
                    <div className="column has-text-centered">
                        <AutocompField name="artist2" label="Artist 2"/>
                    </div>
                    <div className="column"></div>
                </div>

                <div className="columns">
                    <div className="column"></div>
                    <div className="column has-text-centered">
                        <AutocompField name="artist3" label="Artist 3"/>
                    </div>
                    <div className="column has-text-centered">
                        <AutocompField name="artist4" label="Artist 4"/>
                    </div>
                    <div className="column"></div>
                </div>

                <div className="has-text-centered">
                    <button className="button is-warning is-medium m-5" type="submit">Start game!</button>
                </div>

            </form>

        </div>
    )
}

export default ArtistSelectionArea;
    