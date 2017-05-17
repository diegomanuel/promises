# Promises

## Codigo sincronico

````
user_id = get_user_id_from_token(token)
user = User.get(user_id)
posts = Post.get({ id: user.id, tags: user.interests })
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

## Promise
"Aplana" el stack evitando los problemas de CPS, cada "continuacion" es escrita luego de un "then", que ahora pasa a ser como un ";" que separa las sentencias.

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
El then es como un ; capaz de "esperar" por valores asincronicos, pero es capaz de tratar valores sincronicos tambien indistintamente
y ahi vive mucho de su poder para escribir codigo reusable a pesar de tener valores asincronicos.

````
  getUsers()
    .then(function(users) {
       return augmentUsersWithFriends(users);
    })
    .then(function(usersAndFriends) {
      renderView("users", { usersAndFriends: usersAndFriends })
    })
````

Aqui la implementacion de augmentUsersWithFriends puede ser 

### sincronica

````
function augmentUsersWithFriends(users) {
  return users.map((u) => { return { user: u, friends: someObjectInScope.friendsMap[users.id] } })
}
````

### asincronica

````
function augmentUsersWithFriends(users) {
  return new Promise(function(resolve, reject) {
    SomeFriendsDBService.buildMap(users, function(err, friensMap) {
      if(err) {
        reject(err)
      } else {
        return users.map((u) => { return { user: u, friends: friendsMap[users.id] } })
      }
    })
  });
}
````

Y el codigo "cliente" de nuestra funcion `augmentUsersWithFriends` no difiere, ya que si un `then` devuelve una `Promise`
se esperara a su resolucion antes de pasar el resultado a la proxima continuacion, si es un valor, se pasara directamente
el valor a la proxima continuacion sin espera alguna.

