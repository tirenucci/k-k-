## Ceci est la documentation pour le controller User
> Si le status renvoyer n'est pas celui mis a côté de Output c'est q'un problème est survenue dans le back-end
---
URL : ***/user/connection/{token}***  
METHODE: *GET*

> Vérifie que le token sois valide

### Input
```
{
    token: un-token
}
```

### Output status 200
```
{
    status: expired || valid || error
    avatar: 0 || 1
    id: Id de l'utilisateur
}
```
---

URL : ***/user/connection/{token}***  
METHODE: *POST*

> Vérifie que l'email mis sois le bon et enregistre le mot de passe

### Input
```
{
    information: {
        email: maxime.mazet@logipro.com,
        password: azerty
    }
}
```

### Output status 200
```
{
    status: Le mot passe à bien été pris en compte
}
```
---

URL : ***/user/change_password***  
METHODE: *PUT*

> Change le mot de passe de l'utilisateur

### Input
```
{
    information: {
        current_password: bou,
        password: azerty
    }
}
```

### Output status 200
```
{
    status: Le mot passe à bien été pris en compte
}
```
---

URL : ***/user/connection?email&username&password***  
METHODE: *GET*

> Check le email/username et le password si il sont bon et vérifie que le user et actif

### Input
```
{
    email: maxime.mazet@logipro.com,
    username: bou
    password: azerty
}
```

### Output status 200
```
{
    id: 1,
    civility: Monsieur,
    email: maxime.mazet@logipro.com,
    username: maxime, 
    firstname: Maxime,
    lastname: Mazet,
    address: "",
    zip: "",
    city: "",
    country: "France",
    phone: 0600000000,
    registration: d/m/Y,
    society_id: 1,
    society_name: "Logipro",
    function: "Développeur",
    role: "ROLE_LOGIPRO",
    offer: "Logipro",
    avatar: [
        name: "Homme1",
        id: 1,
        path: "assets/img/avatar/homme.png"
    ] | null,
    lang: "fr",
    status: "USER_ACTIF",
    connection_token: 4139f5cd26aeeea4a21c2e6a59bb8a0f6c9d003e,
    token: 7136f5cd26jdiema4a21c2e6a59bb8a0f6c9d5489
}
```
---

URL : ***/user/take_all_avatars***  
METHODE: *GET*

> Récupere tous les avatars en BDD de base ou appartenant au user

### Input
```
{
    
}
```

### Output status 200
```
{
    
    0: [
        name: "Homme1",
        id: 1,
        path: "assets/img/avatar/homme.png"
    ],
    1: [
        name: "Homme2",
        id: 2,
        path: "assets/img/avatar/homme2.png"
    ],
    2: [
        name: "Femme1",
        id: 3,
        path: "assets/img/avatar/femme.png"
    ]
}
```
---

URL : ***/user/profile/change_avatar***  
METHODE: *PUT*

> Permet de changer l'avatar d'un user

### Input
```
{
    user_id: 1
    avatar_id: 1
}
```

### Output status 200
```
{
    id: 1,
    civility: Monsieur,
    email: maxime.mazet@logipro.com,
    username: maxime, 
    firstname: Maxime,
    lastname: Mazet,
    address: "",
    zip: "",
    city: "",
    country: "France",
    phone: 0600000000,
    registration: d/m/Y,
    society_id: 1,
    society_name: "Logipro",
    function: "Développeur",
    role: "ROLE_LOGIPRO",
    offer: "Logipro",
    avatar: [
        name: "Homme1",
        id: 1,
        path: "assets/img/avatar/homme.png"
    ] | null,
    lang: "fr",
    status: "USER_ACTIF",
}
```
---

URL : ***/user/profile/upload_avatar***  
METHODE: *PUT*

> Permet d'upload un nouvelle avatar (pris en compte dans le quota)

### Input
```
{
    image: le_nouvelle_avatar.jpg
}
```

### Output status 200
```
{
    
    name: "Maxime",
    id: 999,
    path: "assets/clients/img/1/avatar/homme.png"
}
```
---

URL : ***/user/profile/upload_new_avatar_post***  
METHODE: *PUT*

> Permet de changer l'avatar sur le user

### Input
```
{
    id_user: 1
    id_image: 1
}
```

### Output status 200
```
{
    id: 1,
    civility: Monsieur,
    email: maxime.mazet@logipro.com,
    username: maxime, 
    firstname: Guillaume,
    lastname: Charmasson,
    address: "",
    zip: "",
    city: "",
    country: "France",
    phone: 0600000000,
    registration: d/m/Y,
    society_id: 1,
    society_name: "Logipro",
    function: "Développeur",
    role: "ROLE_LOGIPRO",
    offer: "Logipro",
    avatar: [
        name: "Homme1",
        id: 1,
        path: "assets/img/avatar/homme.png"
    ],
    lang: "fr",
    status: "USER_ACTIF",
}
```

---
URL : ***/user/update***  
METHODE: *PUT*

> Permet de changer des informations sur le user sans changer le password

### Input
```
{
    firstName: "Guillaume"
    lastName: "Charmasson"
}
```

### Output status 200
```
{
    id: 1,
    civility: Monsieur,
    email: maxime.mazet@logipro.com,
    username: maxime, 
    firstname: Guillaume,
    lastname: Charmasson,
    address: "",
    zip: "",
    city: "",
    country: "France",
    phone: 0600000000,
    registration: d/m/Y,
    society_id: 1,
    society_name: "Logipro",
    function: "Développeur",
    role: "ROLE_LOGIPRO",
    offer: "Logipro",
    avatar: [
        name: "Homme1",
        id: 1,
        path: "assets/img/avatar/homme.png"
    ] | null,
    lang: "fr",
    status: "USER_ACTIF",
}
```
---


URL : ***/user/get_all&society_id***  
METHODE: *GET*

> Permet de récuperer tous les user d'une seul entreprise

### Input
```
{
    society_id: 1
}
```

### Output status 200
```
{
    0: [
        id: 1,
        civility: Monsieur,
        email: maxime.mazet@logipro.com,
        username: maxime, 
        firstname: Maxime,
        lastname: Mazet,
        address: "",
        zip: "",
        city: "",
        country: "France",
        phone: 0600000000,
        registration: d/m/Y,
        society_id: 1,
        society_name: "Logipro",
        function: "Développeur",
        role: "ROLE_LOGIPRO",
        offer: "Logipro",
        avatar: [
            name: "Homme1",
            id: 1,
            path: "assets/img/avatar/homme.png"
        ],
        lang: "fr",
        status: "USER_ACTIF",
        connection_token: 4139f5cd26aeeea4a21c2e6a59bb8a0f6c9d003e,
        token: 7136f5cd26jdiema4a21c2e6a59bb8a0f6c9d5489
    ]

    1: [
        id: 2,
        civility: Monsieur,
        email: guillaume.charmasson@logipro.com,
        username: guillaume,
        firstname: Guillaume,
        lastname: Charmasson,
        address: "",
        zip: "",
        city: "",
        country: "France",
        phone: 0600000100,
        registration: d/m/Y,
        society_id: 1,
        society_name: "Logipro",
        function: "Développeur",
        role: "ROLE_LOGIPRO",
        offer: "Logipro",
        avatar: null,
        lang: "fr",
        status: "USER_ACTIF",
        connection_token: 8452f5cd2sdfdsf4a5456e6a59bb8a0f6c9d0325,
        token: 41269f5cd26jdiemadsqdefd6a59bb8a0f6c9d8456
    ]
}
```
---


URL : ***/user/stat_module?id***  
METHODE: *GET*

> Permet de fait les stat des module et du user

### Input
```
{
    id: 1
}
```

### Output status 200
```
{
    total_training: 1
    grain_average: 5
}
```
---

URL : ***/user/all_user***  
METHODE: *GET*

> Récupère tous les users du logiciel de n'importe quelle sociéter

### Input
```
{
}
```

### Output status 200
```
{
    0: [
        id: 1,
        civility: Monsieur,
        email: maxime.mazet@logipro.com,
        username: maxime, 
        firstname: Maxime,
        lastname: Mazet,
        address: "",
        zip: "",
        city: "",
        country: "France",
        phone: 0600000000,
        registration: d/m/Y,
        society_id: 1,
        society_name: "Logipro",
        function: "Développeur",
        role: "ROLE_LOGIPRO",
        offer: "Logipro",
        avatar: [
            name: "Homme1",
            id: 1,
            path: "assets/img/avatar/homme.png"
        ],
        lang: "fr",
        status: "USER_ACTIF",
        connection_token: 4139f5cd26aeeea4a21c2e6a59bb8a0f6c9d003e,
        token: 7136f5cd26jdiema4a21c2e6a59bb8a0f6c9d5489
    ]

    1: [
        id: 2,
        civility: Monsieur,
        email: guillaume.charmasson@logipro.com,
        username: guillaume,
        firstname: Guillaume,
        lastname: Charmasson,
        address: "",
        zip: "",
        city: "",
        country: "France",
        phone: 0600000100,
        registration: d/m/Y,
        society_id: 1,
        society_name: "Logipro",
        function: "Développeur",
        role: "ROLE_LOGIPRO",
        offer: "Logipro",
        avatar: null,
        lang: "fr",
        status: "USER_ACTIF",
        connection_token: 8452f5cd2sdfdsf4a5456e6a59bb8a0f6c9d0325,
        token: 41269f5cd26jdiemadsqdefd6a59bb8a0f6c9d8456
    ]
}
```
---


URL : ***/user/create***  
METHODE: *POST*

> Permet de créer un utilisateur

### Input
```
{
    userCivility: "Monsieur"
    userFirstName: "Maxime"
    userLastName: "Mazet"
    userAddress: ""
    userZip: "43000"
    userCity: "Le Puy en Velay"
    userCountry: "France"
    userPhone: "0600000000"
    userMail: "maxime.mazet@logipro.com"
    userName: "elbidouilleur"
    userOffer: '1'
    userLang: "fr"
    userRole: "ROLE_LOGIPRO",
    userSociety: 1
    userFunction: "Tech-Lead"
    password: "azerty"
}
```

### Output status 201
```
{
    id: 1,
    civility: Monsieur,
    email: maxime.mazet@logipro.com,
    username: maxime, 
    firstname: Maxime,
    lastname: Mazet,
    address: "",
    zip: "",
    city: "",
    country: "France",
    phone: 0600000000,
    registration: d/m/Y,
    society_id: 1,
    society_name: "Logipro",
    function: "Développeur",
    role: "ROLE_LOGIPRO",
    offer: "Logipro",
    avatar: null,
    lang: "fr",
    status: "USER_ACTIF",
    connection_token: 4139f5cd26aeeea4a21c2e6a59bb8a0f6c9d003e
}
```
---


URL : ***/author/create***  
METHODE: *POST*

> Permet de créer un utilisateur en étant un admin

### Input
```
{
    firstName: "Maxime"
    name: "Mazet"
    email: "maxime.mazet@logipro.com"
    role: "ROLE_LOGIPRO",
    society_id: 1
}
```

### Output status 201
```
{
    id: 1,
    civility: Monsieur,
    email: maxime.mazet@logipro.com,
    username: maxime, 
    firstname: Maxime,
    lastname: Mazet,
    address: "",
    zip: "",
    city: "",
    country: "",
    phone: "",
    registration: d/m/Y,
    society_id: 1,
    society_name: "Logipro",
    function: "",
    role: "ROLE_LOGIPRO",
    offer: "org",
    avatar: null,
    lang: "fr",
    status: "USER_INACTIF",
    connection_token: 4139f5cd26aeeea4a21c2e6a59bb8a0f6c9d003e
}
```
---


URL : ***/user/resendmail***  
METHODE: *POST*

> Permet de renvoyer le mail si le client n'a pas été assez rapide

### Input
```
{
    id: 1
}
```

### Output status 200
```
{
}
```
---


URL : ***/user/get_data?id***  
METHODE: *GET*

> Récupere les infos sur un user

### Input
```
{
    id: 1
}
```

### Output status 200
```
{
        id: 1,
        civility: Monsieur,
        email: maxime.mazet@logipro.com,
        username: maxime, 
        firstname: Maxime,
        lastname: Mazet,
        address: "",
        zip: "",
        city: "",
        country: "France",
        phone: 0600000000,
        registration: d/m/Y,
        society_id: 1,
        society_name: "Logipro",
        function: "Développeur",
        role: "ROLE_LOGIPRO",
        offer: "Logipro",
        avatar: [
            name: "Homme1",
            id: 1,
            path: "assets/img/avatar/homme.png"
        ],
        lang: "fr",
        status: "USER_ACTIF",
        connection_token: 4139f5cd26aeeea4a21c2e6a59bb8a0f6c9d003e,
        token: 7136f5cd26jdiema4a21c2e6a59bb8a0f6c9d5489
}
```
---


URL : ***/user/delete***  
METHODE: *POST*

> Supprime un utilisateur

### Input
```
{
    id: 1
}
```

### Output status 200
```
{
}
```
---


URL : ***/user/edit***  
METHODE: *POST*

> Permet d'éditer entierement un utilisateur

### Input
```
{
    userCivility: "Monsieur"
    userFirstName: "Maxime"
    userLastName: "Mazet"
    userAddress: ""
    userZip: "43000"
    userCity: "Le Puy en Velay"
    userCountry: "France"
    userPhone: "0600000000"
    userMail: "maxime.mazet@logipro.com"
    userName: "elbidouilleur"
    userOffer: '1'
    userLang: "fr"
    userRole: "ROLE_LOGIPRO",
    userSociety: 1
    userFunction: "Tech-Lead"
    password: "azerty"
}
```

### Output status 200
```
{
}
```
---


URL : ***/user/edit_user***  
METHODE: *POST*

> Modifie juste le role du user ou le status

### Input
```
{
    id: 1
    role: "ROLE_LOGIPRO",
    status: "USER_ACTIF",
}
```

### Output status 200
```
{
}
```
---