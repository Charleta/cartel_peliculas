console.log ('hola desde el service');


caches.open('mi-cache').then(cache =>{
    cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        'sw.js',
        'scripts/app.js',
        'pouchdb-8.0.1.js',
        '/34255-espacio-jpg',
        '/favorito',
    ])
});

// self.addEventListener('fetch', event => {
//     const respuesta = fetch(event.request).then( respuestaNetwork => {
//     const respuestaClone = respuestaNetwork.clone();    
//     return caches.open( 'mi-cache' ).then( cache => {
//     cache.put( event.request, respuestaNetwork.clone() );
//     return respuestaNetwork;
//     } )
//     }).catch( error => {
//     return caches.match( event.request)
//     })
//     event.respondWith( respuesta )
//     })

self.addEventListener('fetch', function(evento){
    // Buscamos en la web
    const respuesta = fetch(evento.request).then( respuestaNetwork => {
        return caches.open( 'mi-cache' ).then(  cache => {
            // Si la web responde lo guardo en cache
            cache.put(  evento.request, respuestaNetwork.clone() );
            return respuestaNetwork;
        } )
    }).catch( error => {
        // Si falla busco en el cache
        return caches.match( evento.request)
    })
   
    evento.respondWith( respuesta  )
})