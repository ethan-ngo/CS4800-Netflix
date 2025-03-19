import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItems, getMovies, getShows } from './api'
import '../globals.css'


const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const ProfilePage = () => {
    const navigate = useNavigate()
}
