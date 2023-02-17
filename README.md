# Stoquei
The Stoquei is a simple app for stock management. It was built to be a low-cost, user-friendly and well designed tool, mainly for micro and small enterprises. Nowadays it's possible to manage products in inventory, its suppliers and users accesses.

In order to bulld the application, it was used essentially Vuejs for the front-end and .NET for the back-end, as well as libraries like JQuery, Bootstrap and SweetAlert2.

There is not yet a Stoquei mobile app version, despite that the app is pretty much responsive and mobile-friendly.

## Main pages

### Login
![image](https://user-images.githubusercontent.com/81171856/219528081-60ae4698-ab92-4f8a-946a-f019532b2b1b.png)

### Products
![image](https://user-images.githubusercontent.com/81171856/219528859-e66af8e4-1a8d-49d5-a4d8-67fe6c834791.png)
![image](https://user-images.githubusercontent.com/81171856/219529488-76c5ac55-ca27-4993-9822-81673c556a52.png)
![image](https://user-images.githubusercontent.com/81171856/219529075-36608ed7-a211-480e-a038-7f6be85a2ec9.png)
![image](https://user-images.githubusercontent.com/81171856/219529572-3b16e98a-6984-4874-a3d4-2191c09edc2f.png)
![image](https://user-images.githubusercontent.com/81171856/219531423-324ab495-e54c-4f38-961c-92dc3a2b5b3e.png)


### Suppliers
![image](https://user-images.githubusercontent.com/81171856/219529204-1e903717-baf1-45ad-b3a3-a38a8787d110.png)
![image](https://user-images.githubusercontent.com/81171856/219530426-da711fab-68aa-4b1c-9f1e-d693debc495a.png)


### Users
![image](https://user-images.githubusercontent.com/81171856/219530196-1d7c6703-b663-4232-be04-b2d5b7e58d39.png)
![image](https://user-images.githubusercontent.com/81171856/219530164-10da290d-3171-4210-8acf-49b7d6b30235.png)
![image](https://user-images.githubusercontent.com/81171856/219530387-75c3204f-7225-4f58-b409-9a620269c69d.png)


## Possible improvements
Obviously the app is far far away of perfection, so here it goes a couple of improvements it could be implemented in the future:
- __Storage shared data using a state management library__: there is data used by multiple components in the application, like the api base url, and some user informations stored in cookies. Using Vuex or Pinia, for example, would facilitate and organize the access to it
- __Transform the navbar into a sidebar__: that would probably make the UI looks more like an enterprise tool
- Add a logout button: currently the user needs to clear cookies in order to logout
- Add a 'forgot password' button in the login page
- Improve the responsiveness
- Add pagination at the necessary pages
- Build an orders page, acting like a POS System
- Build a dashboard page, with order and products data visualization
- Implementation of unit tests in the API
- Generate access tokens for the API, in order to give it more security
- Use cloud hosting and create build/release pipelines
