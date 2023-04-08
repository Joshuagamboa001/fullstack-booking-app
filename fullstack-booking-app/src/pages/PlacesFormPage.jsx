import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(100);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/'+id).then(response => {
            const {data} = response
            setTitle(data.title);
            setAddress(data.address)
            setAddedPhotos(data.photos)
            setDescription(data.description)
            setPerks(data.perks)
            setExtraInfo(data.extraInfo)
            setCheckIn(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuests(data.maxGuests)
            setPrice(data.price)
        })

    }, [id])

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }
    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }
    function preInput(header, description) {
        return(
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }
    async function savePlace(e) {
        e.preventDefault();
        const placeData = {title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price}
        if (id) {
            //update
            await axios.put('/places', {id, ...placeData});
            setRedirect(true)

        } else {
            //new place        
            await axios.post('/places', {placeData});
            setRedirect(true)
        }

    }

    if (redirect) {
        return <Navigate to={'/account/places'}/>
    }

    return (
        <div>
            <AccountNav />
            <form onSubmit={savePlace}>
                {preInput('Title', 'Title for your place. Should be short and catchy as in advertisment')}
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title, for example: My lovely apartment" />

                {preInput('Address', 'Address to this place')}
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="address" />

                {preInput('Photos', 'More = better!')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />


                {preInput('Description', 'Description of the place.')}
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

                {preInput('Perks', 'Select all the perks of your place.')}
                <div className="gap-2 mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks} />
                </div>

                {preInput('Extra Info', 'House rules, etc')}
                <textarea value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} />

                {preInput('Check In & Out Times, Max Guests', 'Add check in and out times, remember to have some time window for cleaning the room between guests')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check In Time</h3>
                        <input type="text" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} placeholder="9" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check Out Time</h3>
                        <input type="text" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} placeholder="14" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input type="number" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} placeholder="3" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="3" />
                    </div>
                </div>

                <button className="primary my-4">Save</button>

            </form>
        </div>
    )
}