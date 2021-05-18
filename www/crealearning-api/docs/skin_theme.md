## Ceci est la documentation pour le controller Society
> Si le status renvoyer n'est pas celui mis a côté de Output c'est q'un problème est survenue dans le back-end
---
URL : ***/skintheme/get_all?wantSkin&society_id***  
METHODE: *GET*

> Permet de récuperer tout les thème des skin avec leur skin ou non 

### Input
```
{
    wantSkin: true
    society_id: 1
}
```

### Output status 200
```
[
    {
        "id":1,
        "title":"3D",
        "position":0,
        "status":"_ACTIVE",
        "skin":[
            {
                "id":5,
                "title":"3D (violet)",
                "color_code":"#8846de",
                "color":"Violet",
                "status":"_ACTIVE",
                "folder_name":"purple"
            },
            {
                "id":4,
                "title":"3D (vert)",
                "color_code":"#41bb42",
                "color":"Vert",
                "status":"_ACTIVE",
                "folder_name":"green"
            },
            {
                "id":3,
                "title":"3D (rouge)",
                "color_code":"#c44445",
                "color":"Rouge",
                "status":"_ACTIVE",
                "folder_name":"red"
            },
            {
                "id":2,
                "title":"3D (gris)",
                "color_code":"#b7b7b7",
                "color":"Gris",
                "status":"_ACTIVE",
                "folder_name":"gray"
            },
            {
                "id":1,
                "title":"3D (bleu)",
                "color_code":"#275bc0",
                "color":"Bleu",
                "status":"_ACTIVE",
                "folder_name":"blue"
            }
        ],
        "folder_name":"3d",
        "default_skin":0
    }
]
```
---
URL : ***/skintheme/update***  
METHODE: *PUT*

> Permet de mettre a jour un thème 

### Input
```
{
    skin_theme_id: 1
    skin_theme_status: _ACTIVE
}
```

### Output status 200
```
{

}
```
---
URL : ***/skintheme/last_theme?society***  
METHODE: *GET*

> Permet de mettre a jour un thème 

### Input
```
{
    society: 1
}
```

### Output status 200
```
{
    position: 26
}
```
---
URL : ***/skintheme/create_theme***  
METHODE: *POST*

> Permet de créer un theme d'habillage 

### Input
```
{
    society: 1,
    title: "3D"
    position: 0
}
```

### Output status 201
```

{
    "id":1,
    "title":"3D",
    "position":0,
    "status":"_ACTIVE",
    "folder_name":"3d",
    "default_skin":0
}

```
---
URL : ***/skintheme/theme?id***  
METHODE: *GET*

> Permet de récuperer un theme avec un son id

### Input
```
{
    id: 1,
}
```

### Output status 200
```

{
    "id":1,
    "title":"3D",
    "position":0,
    "status":"_ACTIVE",
    "folder_name":"3d",
    "default_skin":0
}
```
---
URL : ***/skintheme/update_all***  
METHODE: *PUT*

> Permet de modifier un theme

### Input
```
{
    id: 1
    title: "Test",
    position: 1000
}
```

### Output status 200
```
{
}
```
---
URL : ***/skintheme/delete***  
METHODE: *DELETE*

> Permet de supprimer un theme

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