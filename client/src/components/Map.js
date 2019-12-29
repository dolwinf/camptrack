import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {
  NavigationControl,
  Marker,
  Popup,
  GeolocateControl
} from "react-map-gl";
import PinIcon from "./PinIcon";
import Blog from "./Blog";
import Context from "../context";
import differenceInMinutes from "date-fns/difference_in_minutes";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import { GET_PINS_QUERY } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations";
import { useClient } from "../client";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};
const Map = ({ classes }) => {
  const client = useClient();
  useEffect(() => {
    getPins();
  }, []);

  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    getUserPosition();
  }, []);

  const [popup, setPopup] = useState(null);

  const handleSelectPin = pin => {
    setPopup(pin);
    dispatch({ type: "SHOW_PIN_INFO", payload: pin });
  };

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: "GET_PINS", payload: getPins });
    console.log(getPins);
  };
  const getUserPosition = () => {
    //check window for geolocation that comes from navigator
    if ("geolocation" in navigator) {
      //method provided by browser api to get user's current position, which we can then destructure to get lat and long
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        //then set the viewport and userPosition
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  const highlightNewPin = pin => {
    const checkNewPin =
      differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return checkNewPin ? "limegreen" : "darkblue";
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude }
    });
  };

  const isThisUser = () => {
    return state.currentUser._id === popup.author._id;
  };

  const handleDeletePin = async pin => {
    const variable = {
      pinID: pin._id
    };

    const { deletePin } = await client.request(DELETE_PIN_MUTATION, variable);
    dispatch({ type: "DELETE_PIN", payload: deletePin });
    setPopup(null);
  };
  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiZG9sd2luIiwiYSI6ImNrNGY3cW02YjBiOXgza21sejY4ajVuNGUifQ.fhfOUbbpbZ-wOXW9ZTqu7g"
        onViewportChange={newViewport => setViewport(newViewport)}
        {...viewport}
        onClick={handleMapClick}
      >
        <div className={classes.navigationControl}>
          <GeolocateControl
            onViewportChange={getUserPosition}
            positionOptions={{ enableHighAccuracy: true }}
          />
        </div>
        {/* Navigation control <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div> */}
        {/*If user position is set, add a marker using the marker component */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}

        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}

        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size={40}
              color={highlightNewPin(pin)}
            />
          </Marker>
        ))}

        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isThisUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
