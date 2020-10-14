export default function swDev()
{

    // you will need this function later
// our VAPID key must unfortunately be encoded as a Uint8Array (hopefully this will change later), 
// but it will be received as a Base64 encoded string
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
   
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
   
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function determineAppServerKey(){
    let vapidPublicKey = "BCzsYdbUIHI8eMXODxqg_80fYoD2VJczxZYw1mkIG74-Mi5pso5q99eH8-YJaIT0stlIKDAYF3F_O8DkynEaiuI"
    return urlBase64ToUint8Array(vapidPublicKey)
  }
  
  //register a service worker script
  //navigator.serviceWorker.register('push-service-worker.js');
  
  //when the service worker API is ready, check to see if we already have a subscription to Push notifications
  navigator.serviceWorker.ready.then((registration) => {
    registration.pushManager.getSubscription().then((subscription) => {
      if (subscription) {
          console.warn('already having subscription')
          return registration.pushManager.subscribe(
                {
                    userVisibleOnly: true,
                    applicationServerKey:determineAppServerKey()
                }
            )
        // we already have a subscription.
      } else {
        // run the subscribe code below
        console.warn('new subscription created')
        navigator.serviceWorker.ready.then(async function(registration) {
            // call the server at a path that will return our VAPID public key
            const response = await fetch('http://localhost:4002/pushKey');
            const vapidPublicKey =  await response.text();
            
            registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            }).then((subscription) => {
              if (subscription) {
                // this is a valid subscription, send a request to the server to store our subscription info
                fetch('http://localhost:4002/subscribe', {
                  method: 'POST',
                  headers: { 'Content-type': 'application/json' },
                  body: JSON.stringify(subscription)
                });
              }
            });
          });
      }
    });
  });
  
  //use this code to subscribe to Push notifications

  
  //use this code to unsubscribe from Push notifications
//   navigator.serviceWorker.ready.then((registration) => {
//     registration.pushManager.getSubscription().then((subscription) => {
//       if (subscription) {
//         subscription.unsubscribe().then(() => {
//           fetch('http://localhost:4002/unsubscribe', {
//             method: 'POST',
//             headers: { 'Content-type': 'application/json' },
//             body: JSON.stringify(subscription)
//           });
//         });
//       }
//     });
//   });

    let swUrl = `${process.env.PUBLIC_URL}/sw.js`
    navigator.serviceWorker.register(swUrl);
    // .then( (response) => {
    //     return response.pushManager.getSubscription().then(
    //         function(subscription){
    //             return response.pushManager.subscribe(
    //                 {
    //                     userVisibleOnly: true,
    //                     applicationServerKey:determineAppServerKey()
    //                 }
    //             )
    //         }
    //     )
    // })
}