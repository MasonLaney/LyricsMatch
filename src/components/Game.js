import React, {useEffect, useState} from 'react';
import axios from "axios";
import JSSoup from 'jssoup'; 
import ArtistSelectionArea from './ArtistSelectionArea.js';
import RoundArea from './RoundArea.js';

function Game () {

    /*
        Setup stuff
    */

    // personal key for Zenscrape API
    const zenKey = "cdb4fb70-af8a-11eb-93f3-47c9344f6839";

    /*
        Helper functions
    */

    // use Genius API to fetch artist ID from name
    const fetchID = async function(artist) {

        const searchRequest = await axios({
            method: 'GET',
            url: 'https://genius.p.rapidapi.com/search',
            params: {q: artist},
            headers: {
              'x-rapidapi-key': '101a9eaaf7mshbf0d72213fe0ac0p187ea9jsnb03768aac304',
              'x-rapidapi-host': 'genius.p.rapidapi.com'
            }
        });

        return searchRequest.data.response.hits[0].result.primary_artist.id;

    }

    // use Genius API to fetch a list of songs from given artist
    const fetchSongList = async function(id) {

        const songsRequest = await axios({
            method: 'GET',
            url: `https://genius.p.rapidapi.com/artists/${id}/songs`,
            params: {sort: 'popularity'},
            headers: {
                'x-rapidapi-key': '101a9eaaf7mshbf0d72213fe0ac0p187ea9jsnb03768aac304',
                'x-rapidapi-host': 'genius.p.rapidapi.com'
             }
        });
        return songsRequest.data.response.songs;

    }

    // use Zenscrape API to scrape song page for HTML
    const scrapePage = async function(songURL) {

        const scrapeRequest = await axios({
            method: 'GET',
            url: `https://app.zenscrape.com/api/v1/get`,
            params: {
                'url': songURL,
                'apikey': zenKey,
                'location': 'na',
            }
        });
        return scrapeRequest.data;

    }

    // take the HTML from the song page, extract the lyrics, and select a random sequence of n words from it
    const extractLyrics = async function(html) {

        // convert HTML entity numbers into corresponding symbols
        var txt = document.createElement('textarea');
        txt.innerHTML = html;
        html = txt.value;
        txt.remove();

        // extract lyrics using JSSoup, a library inspired by the Python BeautifulSoup library
        let soup = new JSSoup(html);
        let lyrics = "";

        // for some godforsaken reason, the Genius servers return the HTML of the song page
        //     in one of two different structures, and it chooses which one seemingly at random
        if (soup.find('div', 'lyrics') !== undefined) {
            lyrics = soup.find('div', 'lyrics').getText(" ");
        }
        else {
            const lyricsList = soup.findAll('div', 'Lyrics__Container-sc-1ynbvzw-6');
            lyricsList.forEach(e => lyrics += e.getText(" "));
        }

        // remove meta information enclosed in brackets (e.g. [Verse 1], [Chorus], etc.)
        lyrics = lyrics.replaceAll(/\[[^\]]*\]/gm, '');
        
        // choose random set of lyrics n words long
        const lyricsArr = lyrics.split(" ");
        const arrLen = lyricsArr.length - n;
        const startPoint = Math.floor(Math.random() * arrLen);
        const outArr = lyricsArr.slice(startPoint, startPoint + n);
        return outArr.join(' ');

    }

    // handle submission of artist selection
    const handleArtistSelectionSubmit = async function(artistNames) {
        
        setArtists(artistNames);
        
    }

    // get lyrics for a single round
    const getRoundInfo = async function() {

        // randomly select the artist for the round
        const artistNum = Math.floor(Math.random() * 4);
        const artistName = artists[artistNum];

        // get list of songs from artist
        const id = await fetchID(artistName);
        const songList = await fetchSongList(id); 
        
        // randomly choose a song
        const songNum = Math.floor(Math.random() * 20);
        const songURL = songList[songNum].url;
        const songTitle = songList[songNum].title;

        // fetch lyrics for song
        const html = await scrapePage(songURL);
        const lyrics = await extractLyrics(html, n);

        return {lyrics: lyrics, artistNum: artistNum, title: songTitle};

    }

    // play a single round of the game
    const playRound = async function() {

        // prevent game from starting on first render, even though startGame must be called first render
        if (artists === undefined) {
            return;
        }

        // get artist and lyrics for this round
        const songInfo = await getRoundInfo();
        
        // set up area to render
        const roundArea = <RoundArea artists={artists} n={n} songInfo={songInfo} callback={handleRoundSubmit}/>

        setActiveArea(<div key={roundsPlayed}>{roundArea}</div>);
    }

    // when a round is submitted, update stats
    const handleRoundSubmit = function (correct) {

        // increment rounds played
        setRoundsPlayed(roundsPlayed + 1);
        
        // if player's guess was correct, increment the score
        if (correct) {
            setScore(score + 1);
        }
        
    }

    // begin a new game
    const startGame = async function() {

        // prevent game from starting on first render, even though startGame must be called first render
        if (artists === undefined) {
            return;
        }

        // set up how long lyrics sequences should be
        const nVal = 20;
        setN(nVal);

        // display waiting message while songs are loading
        setActiveArea(gameLoadingArea);
        
        // start first round
        await playRound(n);

    }


    /*
        Component state
    */

    // add variable data to the state
    const [score, setScore] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState(0);
    const [n, setN] = useState(20);

    // variable components
    const artistSelectionArea = <ArtistSelectionArea onSubmit={handleArtistSelectionSubmit}/>;
    const gameLoadingArea = <div className="has-text-dark is-size-4 has-text-centered m-5 has-text-weight-normal is-italic"><p>Loading your game, please wait!</p></div>;
    const scoreAreaCode = <div className="has-text-dark is-size-4 has-text-centered m-5 has-text-weight-normal"><p>Score: {score}/{roundsPlayed}</p></div>;

    // add variable data to the state
    const [artists, setArtists] = useState();
    const [activeArea, setActiveArea] = useState(artistSelectionArea);
    const [scoreArea, setScoreArea] = useState(<div></div>);

    // useEffects to prompt updates/rerenders
    useEffect(async () => {
        await startGame();
    }, [artists]);

    useEffect(async () => {
        setScoreArea(scoreAreaCode);
    }, [roundsPlayed]);

    useEffect(async () => {
        playRound();
    }, [roundsPlayed]);

    // components to render
    return (
        <div>

            {scoreArea}
            {activeArea}

        </div>
    )
}

export default Game;
