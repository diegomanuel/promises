# Promises

Para tener un entendimiento claro y preciso de que es una Promise primero debemos tener claro que es el asincronismo y como
se usa CPS en javascript para soportarlo

## Codigo sincronico (ruby :P)

````
user_id = get_user_id_from_token(token)
user = User.get(user_id) # esta llamada es bloqueante
posts = Post.get({ id: user.id, tags: user.interests }) # esta llamada es bloqueante
render_view "posts", { posts: posts }
````

## Codigo asincronico

````
let userId = getUserIdFromToken(token);
User.get(userId, function(user) {
  Post.get({ id: user.id, tags: user.interests }, function(posts) {
    renderView("posts", { posts: posts });
  });
});
````

## Continuation passing style

Cuando se escribe un programa en notación CPS, cada función recibe un parámetro adicional, que representa la Continuación de la función. En lugar de retornar, la función invocará la continuación recibida pasando el valor de retorno. De esta forma, las funciones nunca regresan al código que las llamó, sino que la ejecución del programa transcurre “hacia adelante” sin retornar hasta que el programa finalice.
La notación CPS ocasiona que el tamaño del stack crezca con cada llamada a función, con el peligro de overflow que eso conlleva.


## Implementacion del asincronismo en Javascript

Una vez que tengamos un mejor entendimiento de que es el event loop y el callback queue en javascript nos vamos a meter a fondo en que es una Promise, nos vamos a centrar especialmente en Promises en javascript, tengamos en claro que existen implementaciones de Futures o Promises en otros lenguajes y que la forma de implementar codigo asincronico puede variar entre plataformas

> Si queres entender un poco mas sobre asincronismo y event loop mirate este => https://www.youtube.com/watch?v=8aGhZQkoFbQ

## Promise
Una `Promise` es un valor! En realidad es un poco mas, es un valor + una computacion asociada, el uso de Promises nos permite ser un poco mas "funcionales" a la hora de programar, como vieron en CPS ninguna funcion retorna un "valor", al abstraer el asincronismo en una Promise recuperamos la capacidad de las funciones de devolver "valores".
El uso de Promises tambien "aplana" el stack evitando los problemas de CPS, cada "continuacion" es escrita luego de un "then", que ahora pasa a ser como un ";" que separa las sentencias.
Es importante tener en cuenta que siempre que tengamos una `Promise` en nuestro poder, alguna computacion asincronica esta sucediendo que sera resuelta en algun instante posterior.

Aca podes leer un standard de Promises en Javascript [https://promisesaplus.com/](https://promisesaplus.com/)

````
let userId = getUserIdFromToken(token);
User.get(userId)
  .then(function(user) {
    return Post.get({ id: user.id, tags: user.interests })
  })
  .then(function(post) {
    renderView("posts", { posts: posts });
  });
````

## Then
El then es como un `map` capaz de transformar una Promise en otra Promise que retorne un valor nuevo

`const newArray = [1].map((v) => v + 1)`

`const newPromise = somePromise.then((v) => v + 1)`

### Desafio FiqusPromise

La idea es implementar tu propia version de una Promise, para eso segui estos pasos:

1. `git clone git@github.com:Tyny/promises.git`
2. `npm install`
3. `npm test`
4. Edita `src/promise.js` y hace que pasen todos los tests! Buena Suerte!
