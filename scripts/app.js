const peliculaDiv = document.getElementById('pelicula');
const btnMostrar = document.querySelector('.btn_mostrar');
let iconoFav = document.querySelector('.corazon_favorito');
const btnFav = document.querySelector('.btn_favoritos');
const listaFav = document.querySelector('.listFav');
const listaul = document.querySelector('.listaul');

const db = new PouchDB('favoritos');

// Cargo la API de la página y la guardo en obtenerPeliculas
function obtenerPeliculas() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZWVkZTRjMGJhNzczYzJkNGRlYzEyMDYzODViYTI5YiIsInN1YiI6IjY0OWIwMjNiZmVkNTk3MDBlYTA5YWI3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wygduOri8MjwIKT6-pVjZEoxmJElT0epR5R4kiWspVg'
    }
  };

  return fetch('https://api.themoviedb.org/3/movie/popular?api_key=47e33bf29ef2fc5eaefdc1cd1ed4b0df&language=es-MX', options)
    .then(response => response.json())
    .then(data => data.results)
    .catch(error => {
      console.error(error);
      return []; // Devolver un array vacío en caso de error
    });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------

// Aca muestro las peliculas

  btnMostrar.addEventListener('click', async () => {
  const peliculas = await obtenerPeliculas();
  listaFav.style.display = 'none';
  peliculaDiv.innerHTML = '';

  peliculas.forEach(pelicula => {

    //Toma de datos de la api y carga en variable
    const nombre = pelicula.title;
    const idPeli = pelicula.id;
    const año = pelicula.release_date.slice(0, 4);
    const imagenURL = 'https://image.tmdb.org/t/p/w500' + pelicula.poster_path;
    const detalles = pelicula.overview;

    // cro el div de cada pelicula
    const peliculaItem = document.createElement('div');
    peliculaItem.classList.add('cuadro_pelicula');

    // Se muestra portada como lista de peliculas
    const imagen = document.createElement('img');
    imagen.setAttribute('data_titulo', nombre);
    imagen.src = imagenURL;
    imagen.alt = 'Portada de ' + nombre;

                // Se le da función de click a la imagen para que abra más detalles
                imagen.addEventListener('click', function () {
                  const titulos = this.getAttribute('data_titulo');
                  const modal = document.querySelector('.ventana_modal');

                  const imagenModal = document.getElementById('imagen_ventanaModal');
                  imagenModal.src = imagenURL;
                  imagenModal.alt = 'Portada de ' + nombre;
                  iconoFav.id = idPeli;
                  console.log(iconoFav.id)
                  const titulo = document.getElementById('titulo_ventanaModal');
                  titulo.textContent = nombre;
                  const descripcion = document.getElementById('descripcion_ventaModal');
                  descripcion.textContent = detalles;
                  const añoPelicula = document.getElementById('año_ventanaModal');
                  añoPelicula.textContent = 'Año: ' + año;

                  
                  // Se cambia el display para que aparezca como modal
                  modal.style.display = 'block';

                  // Funcion de cerrar la ventana modal cambiando el display a none
                  const cerrar = document.querySelector('.close');
                  cerrar.addEventListener('click', function () {
                    modal.style.display = 'none';
                  });
                });

    const descripcion = document.createElement('p');
    descripcion.textContent = detalles;

    const titulo = document.createElement('h3');
    titulo.textContent = nombre;

    const info = document.createElement('p');
    info.textContent = 'Año: ' + año;

    peliculaItem.appendChild(imagen);
    peliculaDiv.appendChild(peliculaItem);
  });
});


//-------------------------------------------------------------------------------------------------------------------------------------------------


// Funcion mostrar desde el buscador
// carga de elementos a tomar

const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');

// Funcion de click del boton buscar

  btnBuscar.addEventListener('click', () => {

  const busqueda = inputBuscar.value.trim().toLowerCase();

  if (busqueda === '') {
    // Si no se ingresa ningún valor, no se realiza la búsqueda y se muestran todas las peliculas
    return;
  }

  // Recorro la Api con el valor que se ingreso en busqueda

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZWVkZTRjMGJhNzczYzJkNGRlYzEyMDYzODViYTI5YiIsInN1YiI6IjY0OWIwMjNiZmVkNTk3MDBlYTA5YWI3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wygduOri8MjwIKT6-pVjZEoxmJElT0epR5R4kiWspVg'
    }
  };

  fetch('https://api.themoviedb.org/3/search/movie?query=' + busqueda + '&language=en-US&page=1', options)
    .then(response => response.json())
    .then(data => {


      // en data genero lo mismo que al mostar pero solo de las que se buscaron 

      const peliculas = data.results;
      peliculaDiv.innerHTML = '';

      peliculas.forEach(pelicula => {
        const nombre = pelicula.title;
        
        const idPeli =  pelicula.id;
        const año = pelicula.release_date.slice(0, 4);
        const imagenURL = 'https://image.tmdb.org/t/p/w500' + pelicula.poster_path;
        const detalles = pelicula.overview;

        // Crea los elementos HTML para mostrar la película

        const peliculaItem = document.createElement('div');
        peliculaItem.classList.add('cuadro_pelicula');
        
        const imagen = document.createElement('img');
        imagen.setAttribute('data_titulo', nombre);
        imagen.src = imagenURL;
        imagen.alt = 'Portada de ' + nombre;


          // Se le da función de click a la imagen para que abra más detalles

                        imagen.addEventListener('click', function () {
                          const titulos = this.getAttribute('data_titulo');
                          const modal = document.querySelector('.ventana_modal');

                          const imagenModal = document.getElementById('imagen_ventanaModal');
                          imagenModal.src = imagenURL;
                          imagenModal.alt = 'Portada de ' + nombre;
                          iconoFav.id = idPeli;
                          console.log(iconoFav.id)
                          const titulo = document.getElementById('titulo_ventanaModal');
                          titulo.textContent = nombre;
                          const descripcion = document.getElementById('descripcion_ventaModal');
                          descripcion.textContent = detalles;
                          const añoPelicula = document.getElementById('año_ventanaModal');
                          añoPelicula.textContent = 'Año: ' + año;

                          // Se cambia el display para que aparezca como modal

                          modal.style.display = 'block';

                          // Funcion de cerrar la ventana modal cambiando el display a none

                          const cerrar = document.querySelector('.close');
                          cerrar.addEventListener('click', function () {
                            modal.style.display = 'none';
                          });
                        });

                        


        const titulo = document.createElement('h3');
        titulo.textContent = nombre;

        const info = document.createElement('p');
        info.textContent = 'Año: ' + año;

        const descripcion = document.createElement('p');
        descripcion.textContent = detalles;

        // Agrega los elementos al contenedor adecuado (peliculaDiv)
        peliculaItem.appendChild(imagen);
        
        peliculaDiv.appendChild(peliculaItem);
      });
    })
    .catch(error => console.error(error));

//-----------------------------------------------------------------------------------------------------------------------------------

      //click en corazon de me gusta y que se guarde

      iconoFav.addEventListener('click', ()=>{
        const fecha = new Date().toISOString();

        const listaFav = {
            _id: fecha,
            idPeliGuardada : iconoFav.id,
          }
               
          db.put(listaFav).then(() => {
              console.log('Película guardada en favoritos');
            })
            .catch(error => {
              console.error(error);
            });


           const modal = document.querySelector('.ventana_modal');
            modal.style.display = 'none';

        });
       

        
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //Se carga el service worker
    if( navigator.serviceWorker){
    
    navigator.serviceWorker.register('sw.js');

    } else {
        document.querySelector('main').innerHTML = '<h2> El navegador no ServiceWorker </h2>';
    };

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //Cargar peliculas guardadas
    let peliFav = [];//armo la variable global de pelifav

    function peliculasGuardas () {

        peliculaDiv.innerHTML ='';
        listaul.innerHTML ='';
        
        db.allDocs({include_docs: true, descending: true}).then (documentos =>{
            
            const peliFav = documentos.rows;
            

            peliFav.forEach((item) =>{

                
                listaul.innerHTML += `  
                                        <div class='li_style'>
                                        <li class='li_item'>
                                        <span> ${item.doc.titulo_peli}</span> 
                                        <span class='tachito' onClick="deleteNota(this)"> &#x1F5D1;</span>
                                        </li> 
                                        </div>`;

            //    const nombreFav=item.doc.titulo_peli;

            //     const options = {
            //     method: 'GET',
            //     headers: {
            //     accept: 'application/json',
            //     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZWVkZTRjMGJhNzczYzJkNGRlYzEyMDYzODViYTI5YiIsInN1YiI6IjY0OWIwMjNiZmVkNTk3MDBlYTA5YWI3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wygduOri8MjwIKT6-pVjZEoxmJElT0epR5R4kiWspVg'
            //     }
            //     };
                
            //     fetch('https://api.themoviedb.org/3/search/movie?query=' + nombreFav + '&language=en-US&page=1', options)
            //     .then(response => response.json())
            //     .then(data => mostrarPeliculas(data.results))
            //    .catch(error => console.error(error));
    
            });
            
        

        }).catch (error =>{
            console.error(error)
        })
            listaFav.style.display = 'flex'; 

    };

    btnFav.addEventListener('click', peliculasGuardas);


    const tachito = document.querySelector('.tachito');
    
    function deleteButtonPressed(elemento) {
      const listItem = elemento.parentNode;
      listItem.parentNode.removeChild(listItem);
    }
   

    function deleteNota(elemento) {
      const tituloPelicula = elemento.parentNode.firstChild.textContent;
    
      db.get(tituloPelicula).then(function (doc) {
        db.delete(doc._id).then(function () {
          console.log('Película eliminada de favoritos');
          // Aquí puedes actualizar la lista de favoritos si es necesario
        }).catch(function (error) {
          console.error(error);
        });
      }).catch(function (error) {
        console.error(error);
      });
    }
    

    peliculasGuardas();
    
