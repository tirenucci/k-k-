## Ceci est la documentation pour le controller Society
> Si le status renvoyer n'est pas celui mis a côté de Output c'est q'un problème est survenue dans le back-end
---
URL : ***/society/get_all?wordSearch***  
METHODE: *GET*

> Permet de récuperer toute les society

### Input
```
{
    wordSearch: ""
}
```

### Output status 200
```
[
    {
        "id":1,
        "name":"Logipro",
        "quota":1000000,
        "disk_space":0,
        "logo_name":null,
        "agora_smart":"",
        "monograin_scorm":true,
        "share_mail":"",
        "open_crea":false,
        "skin_default":1
    }
]
```
---
URL : ***/society/create***  
METHODE: *POST*

> Permet de récuperer toute les society

### Input
```
{
    "societyName":"Logipro",
    "societyQuota":1000000 ou -1 pour illimité,
    "agoraLink":"",
    "monograin":true,
    "shareMail":"",
    "opencrea":false,
    "default_skin":1
}
```

### Output status 200
```
[
    {
        "id":1,
        "name":"Logipro",
        "quota":1000000,
        "disk_space":0,
        "logo_name":null,
        "agora_smart":"",
        "monograin_scorm":true,
        "share_mail":"",
        "open_crea":false,
        "skin_default":1
    }
]
```
---
URL : ***/society/get_data?id***  
METHODE: *GET*

> Permet de récuperer des infos sur une society

### Input
```
{
    "id":1,
}
```

### Output status 200
```
{
    "id":1,
    "name":"Logipro",
    "quota":1000000,
    "disk_space":0,
    "logo_name":null,
    "agora_smart":"",
    "monograin_scorm":true,
    "share_mail":"",
    "open_crea":false,
    "skin_default":1
}
```
---
URL : ***/society/update***  
METHODE: *PUT*

> Permet de faire une mis a jour des informations d'une society

### Input
```
{
    "societyName":"Logipro",
    "societyQuota":1000000 ou -1 pour illimité,
    "agoraLink":"",
    "monograin":true,
    "shareMail":"",
    "opencrea":false,
    "default_skin":1
}
```

### Output status 200
```
{
    "id":1,
    "name":"Logipro",
    "quota":1000000,
    "disk_space":0,
    "logo_name":null,
    "agora_smart":"",
    "monograin_scorm":true,
    "share_mail":"",
    "open_crea":false,
    "skin_default":1
}
```
---
URL : ***/society/delete***  
METHODE: *DELETE*

> Permet de supprimer une society

### Input
```
{
    "id":1,
}
```

### Output status 200
```
{
}
```
---
URL : ***/society/quota?id***  
METHODE: *GET*

> Permet de supprimer une society

### Input
```
{
    "id":1 ou rien,
}
```

### Output status 200
```
{
    "percent":"0.00",
    "quota":"1,000",
    "used":"0.00"
}
```
---
URL : ***/society/upload***  
METHODE: *PUT*

> Permet d'upload l'avatar d'une society

### Input
```
{
    "avatar":DataForm,
    "society_id":DataForm,
}
```

### Output status 200
```
{
}
```