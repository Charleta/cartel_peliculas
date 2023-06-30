
const peliculaDiv = document.getElementById('pelicula');
const btnMostrar = document.querySelector('.btn_mostrar');
const iconoFav = document.getElementById('corazon_favorito');
const btnFav = document.querySelector ('.btn_favoritos');
const listaFav = document.querySelector ('.listFav');
const listaul = document.querySelector ('.listaul');
const db = new PouchDB('favoritos');

    
  //Cargo la api de la pagina
    btnMostrar.addEventListener('click' , ()=>{
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZWVkZTRjMGJhNzczYzJkNGRlYzEyMDYzODViYTI5YiIsInN1YiI6IjY0OWIwMjNiZmVkNTk3MDBlYTA5YWI3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wygduOri8MjwIKT6-pVjZEoxmJElT0epR5R4kiWspVg'
      }
    };
  
    fetch('https://api.themoviedb.org/3/movie/20/recommendations?language=en-US&page=1', options)
      .then(response => response.json())
      .then(data => mostrarPeliculas(data.results))
      .catch(error => console.error(error));
  
      })


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

 // Aca muestro las peliculas

    function mostrarPeliculas(peliculas, mostraTodas) {
    
        listaFav.style.display = 'none'; 
        peliculaDiv.innerHTML = '';

        peliculas.forEach(pelicula => {

        const nombre = pelicula.title;
        const año = pelicula.release_date.slice(0, 4);
        const imagenURL = 'https://image.tmdb.org/t/p/w500' + pelicula.poster_path;
        const detalles = pelicula.overview;
      
        //div de cada pelicula

        const peliculaItem = document.createElement('div');
        peliculaItem.classList.add('cuadro_pelicula');

        // Se muestra portada como lista de peliculas   
        const imagen = document.createElement('img');
        imagen.setAttribute ('data_titulo', nombre);

        imagen.src = imagenURL;
        imagen.alt = 'Portada de ' + nombre ;
        
                //Se le da funcion de click a la imagen para que abra mas detalles
                imagen.addEventListener('click' , function (){
                
                const titulos = this.getAttribute('data_titulo');
                const modal = document.querySelector ('.ventana_modal');

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    
                    //click en corazon de me gusta y que se guarde

                    iconoFav.addEventListener('click', ()=>{
                        const fecha = new Date().toISOString();
    
                        const listaFav = {
                            _id: fecha,
                            titulo_peli: nombre,
                          }
                               
                          db.put(listaFav).then(() => {
                              console.log('Película guardada en favoritos');
                            })
                            .catch(error => {
                              console.error(error);
                            });
    
                           
    
                            console.log(nombre)
    
                        });
                      

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

                const imagenModal = document.getElementById('imagen_ventanaModal') ;
                imagenModal.src = imagenURL;
                imagenModal.alt = 'Portada de ' + nombre ;

                const titulo = document.getElementById('titulo_ventanaModal');
                titulo.textContent = nombre;
                const descripcion = document.getElementById ('descripcion_ventaModal');
                descripcion.textContent = detalles;
                const añoPelicula = document.getElementById('año_ventanaModal');
                añoPelicula.textContent = 'Año: ' + año;

                var scrollPosition = window.scrollY;
                //Se cambia el display para que aparezca como modal
                modal.style.display = 'block';
                modal.style.top = scrollPosition + "px";
                modal.style.left = 0;

                            // Funcion de cerrar la ventana modal cambiando el display a none
                            const cerrar = document.querySelector('.close');
                            cerrar.addEventListener('click' , function(){
                            modal.style.display= 'none';
                            })

                
            },
            );

      const descripcion = document.createElement('p');
      descripcion.textContent = detalles;
      const titulo = document.createElement('h3');
      titulo.textContent = nombre;
      const info = document.createElement('p');
      info.textContent = 'Año: ' + año;


      
      
  
      peliculaItem.appendChild(imagen);
      peliculaDiv.appendChild(peliculaItem);

    })

    


};

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------    


    //Funcion mostrar desde el buscador

    const inputBuscar = document.getElementById('inputBuscar');
    const btnBuscar = document.getElementById('btnBuscar');
    //funcion de click del boton buscar
    btnBuscar.addEventListener('click', () => {
    const busqueda = inputBuscar.value.trim().toLowerCase(); // convirtio el string sin espacios y en minusculas
  
    if (busqueda === '') {
      return btnMostrar.click(); // Si no se ingresa ningún valor, no se realiza la búsqueda y se muestra todas las peliculas
    }
    
    // aca traigo de la api la pelicula con el valor del string en busqueda que le pasamos
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZWVkZTRjMGJhNzczYzJkNGRlYzEyMDYzODViYTI5YiIsInN1YiI6IjY0OWIwMjNiZmVkNTk3MDBlYTA5YWI3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wygduOri8MjwIKT6-pVjZEoxmJElT0epR5R4kiWspVg'
      }
    };
  
    fetch('https://api.themoviedb.org/3/search/movie?query=' + busqueda + '&language=en-US&page=1', options)
      .then(response => response.json())
      .then(data => mostrarPeliculas(data.results))
      .catch(error => console.error(error));
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
    
