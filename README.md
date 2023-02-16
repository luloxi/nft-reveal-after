# NFT revealed after minting

## Info for this project:

- Name: Eco Lions Club
- Symbol: ELC
- Total: 50 NFT
- Cost: 0.076 ETH
- Network: Ethereum -> Preguntar

## Pendiente:

- Subir metadata e imagenes a piñata y probar reveal
- Revisar test de withdraw ETH

## Notas:

1. Averiguar cómo integrar window.ethereum y hooks a contratos a wordpress.
   Hay algun plugin o libreria? O habrá que arreglarse con JavaScript a secas?

2. "El contrato debera ser ejecutado 50 veces y elegir al azar unicamente entre los NFTs disponibles. Lazy Minting. (Pseudo-Aleatoriedad)"

Obtener un número aleatorio directo de la blockchain es imposible, ya que al ser un sistema determinístico, tiene variables fijas que estan determinadas de antemano y no están sujetas a incertidumbre, por lo que un mal actor podría utilizar dichas variables para evitar dicho control.

Se puede obtener un número aleatorio utilizando Chainlink VRF, que en mainnet de Ethereum cuesta 0.25 LINK, o unos 2 USD por request (es decir, por cada número aleatorio obtenido). Sin embargo, la utilidad de este número aleatorio tampoco es útil, ya que para no repetirse, debiera ser siempre dicho número distinto dentro del rango 1-50, y no es posible requerir a Chainlink tal limitación.

En caso de ser sencillamente almacenados los números aleatorios, sería lo mismo que crear una lista por orden de minteo 1, 2, 3... Lo cual sólo agrega un paso y costo extra sin dar la aleatoriedad deseada.

Es por eso que decidí, y sugiero, utilizar el método de "reveal", que consiste en proporcionar inicialmente un mismo tokenURI (metadatos e imagen) para todos los NFT minteados por el contrato, que luego, tras realizado el "reveal", cada NFT apuntaría a un tokenURI distinto, evitando así cualquier posible manipulación por parte de los compradores.

El reveal podrá ser únicamente ejecutado por el wallet creador del contrato inteligente, que es el mismo con permisos para retirar los fondos recaudados por dicho contrato.

Esto optimiza costos de gas tanto para el creador del contrato como para quienes lo mintean, y garantiza que no haya manipulación por parte de los compradores para obtener NFTs más raros.

## Strategies for Reveal:

1. Todos los tokenURI estan revelados desde el principio
   Los usuarios habiles podrán elegir cuales NFT mintear con precisión.
2. Server controlled, NFT is revealed as something is minted
   No gas, but needs server which should stay up and running. Image files need to be in random order.
3. Changing the baseURI for IPFS hash to the full collection.
   Requires gas but simplest to implement.
