let firebaseConfig = { 
  apiKey: "AIzaSyDuNkXZah3TncP35fIxA5vRsNnQ6XPhCgo",
  authDomain: "first-project-e3866.firebaseapp.com",
  projectId: "first-project-e3866",
  storageBucket: "first-project-e3866.firebasestorage.app",
  messagingSenderId: "990290633116",
  appId: "1:990290633116:web:7cbe1ccc22c92ca640e859"
};

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

const db = firebase.firestore();// db representa mi BBDD //inicia Firestore

// initialize map1
var map = L.map('map').setView([0, 0], 2);

//initialize map2
var map2 = L.map('map2').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map2);

let markers_map = []
let markers_map2 = []

//get data from the last 24h
async function getData() {
  try {
    const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
    const data = await res.json()
    
    printMap(data)
  }catch(error) {
    console.error(`Error fetching data: ${error}`);
    
  }
  
}

function clearMarkers(markers) {
  markers.forEach(element => {
    element.remove(map)
  });
  markers = []
  
}

function markerColor(mag) {
  let myIcon
  if (Math.floor(mag) <= 0) {
    myIcon = L.icon({
      iconUrl: './assets/mag_0.png',
      iconSize: [30, 30],
    });
  
  }else if (Math.floor(mag) == 1) {
    myIcon = L.icon({
      iconUrl: './assets/mag_1.png',
      iconSize: [30, 30],
    });

  }else if (Math.floor(mag) == 2) {
    myIcon = L.icon({
      iconUrl: './assets/mag_2.png',
      iconSize: [30, 30],
    });

  }else if (Math.floor(mag) == 3) {
    myIcon = L.icon({
      iconUrl: './assets/mag_3.png',
      iconSize: [30, 30],
    });

  }else if (Math.floor(mag) == 4) {
    myIcon = L.icon({
      iconUrl: './assets/mag_4.png',
      iconSize: [30, 30],
    });

  }else if (Math.floor(mag) == 5) {
    myIcon = L.icon({
      iconUrl: './assets/mag_5.png',
      iconSize: [30, 30],
    });

  }else if (Math.floor(mag) == 6) {
    myIcon = L.icon({
      iconUrl: './assets/mag_6.png',
      iconSize: [30, 30],
    });

  }else if (Math.floor(mag) == 7) {
    myIcon = L.icon({
      iconUrl: './assets/mag_7.png',
      iconSize: [30, 30],
    });

  }

  return myIcon
}


//print the first map
function printMap(data) {
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  clearMarkers(markers_map)

  data.features.forEach(earthquake => {

    const myIcon = markerColor(earthquake.properties.mag)
    

    //place markers
    const marker = L.marker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {icon: myIcon}).addTo(map)
    marker.bindPopup(`<form id="favorite">
                      <p>Title: ${earthquake.properties.title}</p>
                      <input type="hidden" name="title" value="${earthquake.properties.title}">
                      <p>Time: ${new Date(earthquake.properties.time)}</p>
                      <input type="hidden" name="time" value="${new Date(earthquake.properties.time)}">
                      <p>Location: ${earthquake.properties.place}</p>
                      <input type="hidden" name="location" value="${earthquake.properties.place}">
                      <p>Code: ${earthquake.properties.code}</p>
                      <input type="hidden" name="code" value="${earthquake.properties.code}">
                      <p>Magnitude: ${earthquake.properties.mag}</p>
                      <input type="hidden" name="mag" value="${earthquake.properties.mag}">
                      <input type="hidden" name="id" value="${earthquake.id}">
                      <input type="hidden" name="latitude" value="${earthquake.geometry.coordinates[1]}">
                      <input type="hidden" name="longitude" value="${earthquake.geometry.coordinates[0]}">
                      <input id="favorite-btn" type="submit" value="Favorite">
                      </form>`)
    
    
    markers_map = [...markers_map, marker]
    
    
  });
  
}

map.on('popupopen',  (event) => {
    const favoriteBtn = document.getElementById("favorite")
    const deleteBtn = document.getElementById('delete-favorite')
    if (favoriteBtn) {
      favoriteBtn.addEventListener('submit', (event) => {
        event.preventDefault()
        
        const earthquake = {
          id: event.target.elements.id.value,
          title: event.target.elements.title.value,
          time: event.target.elements.time.value,
          location: event.target.elements.location.value,
          code: event.target.elements.code.value,
          mag: event.target.elements.mag.value,
          lat: event.target.elements.latitude.value,
          lng: event.target.elements.longitude.value,
        }

        addToFavorites(earthquake)
        })
    }
    if (deleteBtn) {
      deleteBtn.addEventListener('click', deleteFavorite)
    }
    
    }) 


function printMap2(data) {
  clearMarkers(markers_map2)


  data.features.forEach(earthquake => {
    const myIcon = markerColor(earthquake.properties.mag)
    


    const marker = L.marker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {icon: myIcon}).addTo(map2)
    marker.bindPopup(`<p>Title: ${earthquake.properties.title}</p>
                      <p>Time: ${new Date(earthquake.properties.time)}</p>
                      <p>Location: ${earthquake.properties.place}</p>
                      <p>Code: ${earthquake.properties.code}</p>
                      <p>Magnitude: ${earthquake.properties.mag}</p> `)


    markers_map2 = [...markers_map2, marker]
  });
  
  
}

//filters
const magFilter = document.getElementById('filter-mag')
const startDateFilter = document.getElementById('filter-start-date')
const endDateFilter = document.getElementById('filter-end-date')

magFilter.onchange = () => filterData(magFilter.value, startDateFilter.value, endDateFilter.value)
startDateFilter.onchange = () => filterData(magFilter.value, startDateFilter.value, endDateFilter.value)
endDateFilter.onchange = () => filterData(magFilter.value, startDateFilter.value, endDateFilter.value)




async function filterData(magnitude = undefined, time_start = undefined, time_end = undefined) {
  let res
  if (magnitude && time_start && time_end) {
    res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=${magnitude}&maxmagnitude=${magnitude+'.9'}&starttime=${time_start}&endtime=${time_end}`)
    console.log('mag,start,end');
     
  }else if (magnitude && !time_start && time_end) {
    res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=${magnitude}&maxmagnitude=${magnitude+'.9'}&endtime=${time_end}`)
    console.log('mag,end');

  }else if (magnitude && time_start && !time_end) {
    res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=${magnitude}&maxmagnitude=${magnitude+'.9'}&starttime=${time_end}`)
    console.log('mag,start');

  }else if (magnitude && !time_start && !time_end) {
    res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=${magnitude}&maxmagnitude=${magnitude+'.9'}`)
    console.log('mag');

  }else if (!magnitude && time_start && time_end) {
    res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${time_start}&endtime=${time_end}`)
    console.log('start,end');

  }else if (!magnitude && time_start && !time_end) {
    res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${time_start}`)
    console.log('start');

  }else if (!magnitude && !time_start && time_end) {
    res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&endtime=${time_end}`)
    console.log('end');

  }else {
    res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson`)
    console.log('nenhum');

  }
  const data = await res.json()

  
  printMap2(data)
}

function signUpUser(email, password) {
  firebase.auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredentials) => {
            let user = userCredentials.user

            createUser({
              id: user.uid,
              email: user.email
            })
          })
          .catch((error) => {
            console.error(`Error in the system ${error.message} Error: ${error.code}`)
          })

}

function createUser(user) {
  db.collection("user earthquake").doc(user.id)
  .set({
    email: user.email,
    favorites: []
  })
  .then(() => console.log(user.id))
}

function loginUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredentials) => console.log(userCredentials.user.email))
  .catch((error) => {
    const errorMessage = error.message
    console.error(`Error during login: ${errorMessage}`)
  })
}

function logoutUser() {
  firebase.auth().signOut()
  const forms = document.getElementsByClassName('form-section')
  for (const form of forms) {
    form.style.display = 'block'
  }
  document.getElementById('logout-btn').style.display = 'none'
}



function addToFavorites(earthquake) {
  const user = firebase.auth().currentUser

  if (!user) {
    alert('You need to be logged in to save to favorites')
    return
  }

  const userRef = db.collection('user earthquake').doc(user.uid)
  userRef.get().then((doc) => {
    if (doc.exists) {
      const favorites = doc.data().favorites
      let flag = false
      favorites.forEach(favEarthquake => {
        if (favEarthquake.id === earthquake.id) {
          flag = true
        }
      });
      if (!flag) {
        const updatedFavorites = [...favorites, earthquake]

        userRef.update({favorites: updatedFavorites})
        .then(() => alert('saved to favorites'))
        .catch((error) => console.error(`Error saving to favorites ${error.message}`))
      } else {
        alert("already in favorites")
      }
      
    }
  })
  

  // let flag = false
  // db.collection("favorite earthquake")
  // .get()
  // .then((doc) => {
  //   doc.forEach(savedEarthquake => {
  //     if (savedEarthquake.data().id == earthquake.id) {
  //       flag = true
  //     }
  //   });
  // })
  // .then(() => {
  //   if (!flag) {
  //     db.collection("favorite earthquake")
  //     .add(earthquake)
  //     .catch((error) => console.error(`Error adding earthquake: ${error}`))
  //   }
  //   else {
  //     alert("already in favorites")
  //   }
  // })
}

function printFavorites() {
  const user = firebase.auth().currentUser

  if (!user) {
    alert('You need to be logged in to see favorites')
    return
  }

  const userRef = db.collection('user earthquake').doc(user.uid)
  userRef.get().then((doc) => {
    const favorites = doc.data().favorites

    clearMarkers(markers_map)
    favorites.forEach(earthquake => {
      const myIcon = markerColor(earthquake.mag)

      const marker = L.marker([earthquake.lat, earthquake.lng], {icon: myIcon}).addTo(map)
      marker.bindPopup(`<p>Title: ${earthquake.title}</p>
                         <p>Time: ${earthquake.time}</p>
                         <p>Location: ${earthquake.location}</p>
                         <p>Code: ${earthquake.code}</p>
                         <p>Magnitude: ${earthquake.mag}</p>
                         <input id="delete-id" type="hidden" value="${earthquake.id}">
                         <button id="delete-favorite">Delete Favorite</button> `)

      markers_map = [...markers_map, marker]
    });
  })

  // db.collection("favorite earthquake")
  // .get()
  // .then(doc => {
  //   clearMarkers(markers_map)
  //   doc.forEach(earthquake => {
      

  //     const myIcon = markerColor(earthquake.data().mag)

  //     const marker = L.marker([earthquake.data().lat, earthquake.data().lng], {icon: myIcon}).addTo(map)
  //     marker.bindPopup(`<p>Title: ${earthquake.data().title}</p>
  //                        <p>Time: ${earthquake.data().time}</p>
  //                        <p>Location: ${earthquake.data().location}</p>
  //                        <p>Code: ${earthquake.data().code}</p>
  //                        <p>Magnitude: ${earthquake.data().mag}</p>
  //                        <input id="delete-id" type="hidden" value="${earthquake.id}">
  //                        <button id="delete-favorite">Delete Favorite</button> `)

  //     markers_map = [...markers_map, marker]
  //   })
    
  // })
  
}

function deleteFavorite() {
  const user = firebase.auth().currentUser
  const deleteId = document.getElementById('delete-id').value

  const userRef = db.collection('user earthquake').doc(user.uid)
  userRef.get().then((doc) => {
    const favorites = doc.data().favorites
    const updatedFavorites = favorites.filter((earthquake) => earthquake.id != deleteId)

    userRef.update({favorites: updatedFavorites})

    alert(`Earthquake deleted from favorites`)
    printFavorites() 
  })

  // db.collection('favorite earthquake')
  // .then(() => {
  //   alert(`earthquake deleted`)
  //   printFavorites() 
  // })

}

document.getElementById('fav-data').addEventListener('click', printFavorites)
document.getElementById('api-data').addEventListener('click', getData)


document.getElementById("register").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email.value;
  let pass = event.target.elements.password.value;
  let pass2 = event.target.elements.password2.value;

  pass === pass2 ? signUpUser(email, pass) : alert("error password");

  document.getElementById('register').reset()
})


document.getElementById('login').addEventListener('submit',(event) => {
  event.preventDefault()

  const email = event.target.email.value
  const pass = event.target.password.value

  loginUser(email, pass)

  document.getElementById('login').reset()
  const forms = document.getElementsByClassName('form-section')
  for (const form of forms) {
    form.style.display = 'none'
  }
  document.getElementById('user').innerHTML += `${email}`
  document.getElementById('logout-btn').style.display = 'flex'
})



document.getElementById('logout-btn').style.display = 'none'

getData()