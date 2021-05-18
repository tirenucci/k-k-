## Ceci est la documentation pour le controller TrainingLanguage
> Si le status renvoyer n'est pas celui mis a côté de Output c'est q'un problème est survenue dans le back-end
---
URL : ***/training_language/get_all?society_id***  
METHODE: *POST*

> Récupere tous les languages dispo pour une entreprise dispo

### Input
```
{
    society_id: 1
}
```

### Output status 200
```
{
    lang: [
        0: [
            'label_fr' => "Français",
            'label' => "_FRANCAIS",
            'iso_code_6393' => "fra",
            'iso_code_6391' => "fr",
            'image_name' => "fr",
            'encode' => "UTF-8",
            'position' => 1,
            'active' => 1
        ]
    ]
    enable: [
        1
    ]
}
```
---
URL : ***/training_language/get_all_by_training?society_id***  
METHODE: *GET*

> Recupère tous les language mis sur un training

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
        'label_fr' => "Français",
        'label' => "_FRANCAIS",
        'iso_code_6393' => "fra",
        'iso_code_6391' => "fr",
        'image_name' => "fr",
        'encode' => "UTF-8",
        'position' => 1,
        'active' => 1
    ]
}
```
---
URL : ***/training_language/get_one?lang***  
METHODE: *GET*

> Recuper une seul lang

### Input
```
{
    lang: "fr"
}
```

### Output status 200
```
{
    0: [
        'label_fr' => "Français",
        'label' => "_FRANCAIS",
        'iso_code_6393' => "fra",
        'iso_code_6391' => "fr",
        'image_name' => "fr",
        'encode' => "UTF-8",
        'position' => 1,
        'active' => 1
    ]
}
```