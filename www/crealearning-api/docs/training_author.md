## Ceci est la documentation pour le controller TrainingAuthor
> Si le status renvoyer n'est pas celui mis a côté de Output c'est q'un problème est survenue dans le back-end
---
URL : ***/training_author/right?id_training***  
METHODE: *GET*

> Permet de récuperer tous les auteurs d'un training

### Input
```
{
    id_training: 1
}
```

### Output status 200
```
[
    {
        "id":1,
        "last_name":"Admin",
        "first_name":"Logipro",
        "role":"ROLE_LOGIPRO",
        "is_owner":true,
        "is_editor":true,
        "id_training":1
    }
]
```
---
URL : ***/training_author/add***  
METHODE: *POST*

> Permet de rajouter un auteur a un module

### Input
```
{
    id_training: 1
    id_user: 1
}
```

### Output status 200
```
{}
```
---
URL : ***/training_author/delete***  
METHODE: *DELETE*

> Permet de supprimer un auteur d'un module

### Input
```
{
    training_id: 1
    user_id: 1
}
```

### Output status 200
```
{}
```
---
URL : ***/training_author/update***  
METHODE: *PUT*

> Permet de mettre a jour les droit d'un auteur

### Input
```
{
    training_id: 1
    user_id: 1
    is_editor: true
}
```

### Output status 200
```
{}
```
---
URL : ***/training_author/get_right?training_id&id***  
METHODE: *GET*

> Permet de récuperer les droit d'un utilisateur sur un training

### Input
```
{
    training_id: 1
    id: user id
}
```

### Output status 200
```
{
    "id":1,
    "last_name":"Admin",
    "first_name":"Logipro",
    "role":"ROLE_LOGIPRO",
    "is_owner":true,
    "is_editor":true,
    "id_training":1
}
```