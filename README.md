# Stoquei
The Stoquei is a simple app for stock management. It was built to be a low-cost, user-friendly and well designed tool, mainly for micro and small enterprises. Nowadays it's possible to manage products in inventory, its suppliers and users accesses.

In order to bulld the application, it was used essentially Vuejs for the front-end and .NET for the back-end, as well as libraries like JQuery, Bootstrap and SweetAlert2.

There is not yet a Stoquei mobile app version, despite that the app is pretty much responsive and mobile-friendly.

If you want to see part of the project architecture, check out the [stoquei-api repo](https://github.com/gustavenrique/stoquei-api).

---
## Main features and pages

### Users
[users.webm](https://user-images.githubusercontent.com/81171856/219884582-7d376622-9465-4de1-b3f6-f1c213fbb10e.webm)

### Email received
[email.webm](https://user-images.githubusercontent.com/81171856/219884601-325b40be-eee4-4ccd-b2fb-307eb208859e.webm)

### Login
[login.webm](https://user-images.githubusercontent.com/81171856/219884603-12196ba5-2286-48db-95bb-09e8e5d17134.webm)

### Forbidden and NotFound
[forbidden and notfound.webm](https://user-images.githubusercontent.com/81171856/219884613-7f19290f-9e7d-4b6f-a068-63a92e1bb1f7.webm)

### Suppliers
[suppliers.webm](https://user-images.githubusercontent.com/81171856/219884623-0334cdc3-6d59-4fff-aa35-62b75815c124.webm)

### Responsiveness
[responsiveness.webm](https://user-images.githubusercontent.com/81171856/219884628-bb677dc4-f988-4f66-a312-554bb9b2fab6.webm)

### Products
[products.webm](https://user-images.githubusercontent.com/81171856/219884969-75c382a1-de9b-499c-8b8e-6d78875b1140.webm)


---
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
