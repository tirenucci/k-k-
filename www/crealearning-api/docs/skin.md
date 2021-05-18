## Ceci est la documentation pour le controller Skin
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