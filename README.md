[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)

# T2 AuthenticationHandler
This repository is in charge of ensuring authentication for the Dentistimo project. For this, it provides our user with the functionality to be able to Sign In, Sign Up, Sign Out or authenticate an appointment booking. 

This platform has been developed using a [**Clean Architecture**](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) and referring to **SOLID Principles**. That is, group the different classes that we were using in different folders such as Infrastructure, Application and Domain in order to keep clear the sepparation of concerns. Having these folders helped us understand where each functionality of the program was located and thus maintain a certain order in the creation of the code.

## 🛠 Pre-Requirements 
There are some technical requirements that need to be taken into consideration before having full access to the program's functionality, such as:

- Install a suitable IDE for TypeScript (recommending [Visual Studio Code](https://visualstudio.microsoft.com/))
- Installing [NodeJS](https://nodejs.org/en/download/) V14.21.2 or greater
- Installing [Mongoose](https://mongoosejs.com/) (MongoDB object-database mapper)

In order to install the **required packages** for the system to execute, make sure to run the following command:
```
npm i
```

Furthermore, this module establishes communication with others via **MQTT** via [HiveMQ](https://www.hivemq.com/) which is a standard messaging protocol. Having MQTT publish/subscribe protocol provides a scalable and reliable way to connect devices over the Internet

Some more information about the MQTT protocol can be read [here](https://www.hivemq.com/docs/hivemq/4.10/user-guide/introduction.html)

## 🚀 Getting Started 

- Would be to **clone** the repository from GitLab

HTTPS
```
git clone https://git.chalmers.se/courses/dit355/dit356-2022/t-2/T2-AuthenticationHandler.git
```

SSH
```
git clone git@git.chalmers.se:courses/dit355/dit356-2022/t-2/T2-AuthenticationHandler.git
```
- Open the project in the selected IDE

- Once the repository has been succesfully cloned in your machine and having installed all of the **dependencies** via npm. 
Open a terminal in your preferred IDE where this project has been opened in and run the following command to **execute the module** and leave it ready for communication with the others:
```
cd src/Infrastructure/Controllers/
npm run compile
node Main.js
```


## 👤 Authors and acknowledgment
Aditya - @adityaa

Aleksey - @aleksey

Danesh - @daneshm

Andrea - @fulger

Kwabena - @kwabenaa

Anton - @antongol

Oscar - @scarr


