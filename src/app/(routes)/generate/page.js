"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios'

export default function Generate() {
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [tracks, setTracks] = useState([])

  const mood = searchParams.get('mood');
  const genres = searchParams.getAll('genres');

  console.log(genres);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        const recs = await generateSongRecs()
        console.log(recs)
        setTracks(recs)
      } catch (err) {
        console.warn(err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  async function generateSpotifyAPIKey() {
    return new Promise(async (resolve, reject) => {
      try {
        var client_id = '793d754b816441618f4e11c3e5db3b37';
        var client_secret = '146042a7f95d4c8bb586b516a9507c4b';

        const res = await axios.post('https://accounts.spotify.com/api/token', {
          grant_type: 'client_credentials'
        }, {
          headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        const body = res.data
        var token = body.access_token;
        resolve(token)
      } catch (err) {
        reject(err)
      }
    })
  }

  async function generateSongRecs() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await generateSpotifyAPIKey()
  
        const res = await axios.get('https://api.spotify.com/v1/search', {
          params: {
            query: `mood:${mood}`,
            type: "track",
            limit: "50"
          },
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        const body = res.data
        const tracks = body.tracks
        resolve(tracks.items)
      } catch (err) {
        reject(err)
      }
    })
  }

  return (
    <main className="flex flex-row justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        {/* TITLE */}
        <h1 className="mt-5 text-white text-5xl font-bold">Your generated playlist</h1>

        <h2 className="text-white">debug params:</h2>
        <h2 className="text-white">mood: { mood }</h2>
        <h2 className="text-white">genres:</h2>
        { genres.map((g, index) => <h2 className="text-white" key={index}>{ g }</h2>) }

        {/* PLAYLIST */}
        {/* TODO: generate playlist and display */}
      </div>
    </main>
  )
}
