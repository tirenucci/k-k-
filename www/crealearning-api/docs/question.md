## Ceci est la documentation pour le controller Question
> Si le status renvoyer n'est pas celui mis a côté de Output c'est q'un problème est survenue dans le back-end
---
URL : ***/grain/question/save***  
METHODE: *POST*

> Permet de créer un block de type question

### Input
```
{
    Les inputs sont variable selon.
}
```

### Output status 201
```
{
    Pareil que les inputs c'est variable selon le type de question
}
```
---
URL : ***/grain/question/get?get_all***  
METHODE: *GET*

> Permet de créer un block de type question

### Input
```
{
    grain_id: 1
}
```

### Output status 200
```
{
    Les outputs sont variable selon le type de question
}
```