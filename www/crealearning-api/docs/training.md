## Ceci est la documentation pour le controller Training
> Si le status renvoyer n'est pas celui mis a côté de Output c'est q'un problème est survenue dans le back-end
---
URL : ***/training/get_all?society_id&order&target&status&wordSearch***  
METHODE: *GET*

> Récupère tous les trainings selons le trie et la société

### Input
```
{
    society_id: 1
    order: DESC ou ASC
    target: le champs en bdd qu'on veut order
    status: peut être null mais c'est le status du training
    wordSearch: ce qu'il y a dans la barre de search
}
```

### Output status 200
```
{
    {
        "training":[
            {
                "id":1,
                "name":
                "Bien d\u00e9buter",
                "description":"Ceci est un module g\u00e9n\u00e9rer pour faire des tests il n\u0027a donc aucun se...",
                "author":[
                    {
                        "id":1,
                        "name":
                        "Logipro Admin"
                    }],
                    "version":"1.0",
                    "created_at":"18-08-2020 \u00e0 10:13",
                    "updated_at":"18-08-2020 \u00e0 10:13",
                    "disk_space":0,
                    "status":"_UNDERCONSTRUCTION",
                    "duration":0,
                    "uuid":"cf32c953-cd2c-42fb-8751-bb7f435b015d",
                    "tag":["GitGud","Tag"]
            }
        ],
        "count":"1"
    }
}
```
---

URL : ***/training/create***  
METHODE: *POST*

> Permet de créer un module

### Input
```
{
    lang: Français
    society: 1
    skin: null ou l'id du skin
    author: id de l'user
    description: Ceci est la description du module que je viens de créer
    name: Nom du module
}
```

### Output status 201
```
{
    id: 3
}
```
---

URL : ***/training/get_all_theme&society_id***  
METHODE: *GET*

> Permet de récuperer tous les theme possible pour un training

### Input
```
{
    society_id: 1
}
```

### Output status 200
```
{
    [
        {
            "id":10,
            "title":"Internet",
            "position":9,
            "status":"_ACTIVE",
            "skin":[
                {
                    "id":40,
                    "title": "Internet",
                    "color_code":"#f72198",
                    "color":"Rose",
                    "status":"_ACTIVE",
                    "folder_name":"pink"
                }
            ],
            "folder_name":"internet",
            "default_skin":0
        }
    ]
}
```
---

URL : ***/training/delete***  
METHODE: *DELETE*

> Permet de supprimer un module

### Input
```
{
    id: 2
}
```

### Output status 200
```
{
}
```
---

URL : ***/training/duplique***  
METHODE: *POST*

> Permet de faire dupliquer un module

### Input
```
{
    id: 2
}
```

### Output status 200
```
{
}
```
---

URL : ***/training/get&id***  
METHODE: *GET*

> Permet de récuperer un training

### Input
```
{
    id: 1
}
```

### Output status 200
```
{
    "id":1,
    "name":"Bien d\u00e9buter",
    "description":"Ceci est un module g\u00e9n\u00e9rer pour faire des tests il n\u0027a donc aucun sens",
    "version":"1.0",
    "license":"_CC",
    "show_ponderation":true,
    "status":"_UNDERCONSTRUCTION",
    "duration":0,
    "uuid":"cf32c953-cd2c-42fb-8751-bb7f435b015d",
    "language_code":"fr",
    "logo":"0",
    "logo_position":"left",
    "tags":"GitGud, Tag",
    "created_at":"18\/08\/2020 \u00e0 10:13",
    "updated_at":"18\/08\/2020 \u00e0 10:13",
    "disk_space":0,
    "grain_duration":0,
    "grain_count":1,
    "society_name":"Logipro",
    "skin_path":"home_help\/blue",
    "objective":"",
    "educ_means":"",
    "tech_means":"",
    "management":"",
    "achievements":"",
    "public_target":"",
    "prerequisite":"",
    "firstName":"Logipro",
    "lastName":"Admin"
}
```
---

URL : ***/training/update***  
METHODE: *PUT*

> Permet de modifier un module

### Input
```
{
    training: {
        name: "Test",
        description: "Une description",
        tags: "GitGd, Créa",
        version: 1.2,
        license: _CC,
        show_ponderation: true,
        status: _UNDERCONSTRUCTION,
        duration: 10,
        objective: "",
        educ_means: "",
        tech_means: "",
        management: "",
        achievements: "",
        public_target: "",
        prerequisite: ""
    },
    skin_id: 1,
    languages: 1
}
```

### Output status 200
```
{
    "id":1,
    "name":"Test",
    "description":"Une description",
    "version":"1.2",
    "license":"_CC",
    "show_ponderation":true,
    "status":"_UNDERCONSTRUCTION",
    "duration":10,
    "uuid":"cf32c953-cd2c-42fb-8751-bb7f435b015d",
    "language_code":"fr",
    "logo":"0",
    "logo_position":"left",
    "tags":"GitGud, Tag",
    "created_at":"18\/08\/2020 \u00e0 10:13",
    "updated_at":"18\/08\/2020 \u00e0 10:13",
    "disk_space":0,
    "grain_duration":0,
    "grain_count":1,
    "society_name":"Logipro",
    "skin_path":"home_help\/blue",
    "objective":"",
    "educ_means":"",
    "tech_means":"",
    "management":"",
    "achievements":"",
    "public_target":"",
    "prerequisite":"",
    "firstName":"Logipro",
    "lastName":"Admin"
}
```
---

URL : ***/training/update_with_image***  
METHODE: *PUT*

> Permet de modifier un module et son image

### Input
```
{
    training: {
        name: "Test",
        description: "Une description",
        tags: "GitGd, Créa",
        version: 1.2,
        license: _CC,
        show_ponderation: true,
        status: _UNDERCONSTRUCTION,
        duration: 10,
        objective: "",
        educ_means: "",
        tech_means: "",
        management: "",
        achievements: "",
        public_target: "",
        prerequisite: ""
    },
    skin_id: 1,
    languages: 1,
    image: l'image envoyer avec un DataForm
}
```

### Output status 200
```
{
    
}
```